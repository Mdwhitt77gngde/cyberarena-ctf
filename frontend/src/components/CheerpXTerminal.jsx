import { useEffect, useRef, useState } from 'react'

const CHALLENGE_SETUP = {
  'Lost in the Files': {
    initCmd: 'echo "CTF{h1dd3n_f1l3s_4r3_3asy}" > /root/.secret_note && exec bash',
  },
  'Permission Denied': {
    initCmd: 'echo REDACTED > /root/secret.txt && echo "CTF{p3rm1ss10ns_4r3_3v3ryth1ng}" > /root/.secret_backup && chmod 000 /root/secret.txt && exec bash',
  },
  'The Hidden Process': {
    initCmd: "env FLAG='CTF{pr0c3ss_3nv_s3cr3ts}' sleep infinity & exec bash",
  },
}

export default function CheerpXTerminal({ challengeTitle }) {
  const terminalRef = useRef(null)
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    let cancelled = false
    const setup = CHALLENGE_SETUP[challengeTitle] ?? {}

    async function boot() {
      try {
        const CheerpX = await import(/* @vite-ignore */ 'https://cxrtnc.leaningtech.com/1.2.8/cx.esm.js')
        if (cancelled) return

        const cloudDevice = await CheerpX.CloudDevice.create(
          'wss://disks.webvm.io/debian_large_20230522_5044875331.ext2'
        )
        const idbDevice = await CheerpX.IDBDevice.create('block1')
        const overlayDevice = await CheerpX.OverlayDevice.create(cloudDevice, idbDevice)

        const cx = await CheerpX.Linux.create({
          mounts: [
            { type: 'ext2', dev: overlayDevice, path: '/' },
            { type: 'devs', path: '/dev' },
            { type: 'proc', path: '/proc' },
          ],
        })

        if (cancelled) return
        cx.setConsole(terminalRef.current)
        setStatus('ready')

        const args = setup.initCmd ? ['-c', setup.initCmd] : []
        await cx.run('/bin/bash', args, {
          env: ['HOME=/root', 'TERM=xterm', 'USER=root', 'SHELL=/bin/bash', 'EDITOR=vim'],
          cwd: '/root',
          uid: 0,
          gid: 0,
        })
      } catch (err) {
        if (!cancelled) setStatus(err?.message || String(err))
      }
    }

    boot()
    return () => { cancelled = true }
  }, [challengeTitle])

  return (
    <div className="w-full h-full relative" style={{ minHeight: '500px' }}>
      {status === 'loading' && (
        <div className="absolute inset-0 bg-[#060c14] flex flex-col items-center justify-center gap-2 z-10">
          <div className="w-5 h-5 border-2 border-[#4a9eff] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-[#4a6080]">Booting Linux environment...</span>
        </div>
      )}
      {status !== 'loading' && status !== 'ready' && (
        <div className="absolute inset-0 bg-[#060c14] flex flex-col items-center justify-center gap-3 z-10 p-6">
          <span className="text-xs text-red-400 font-medium">Terminal failed to load</span>
          <code className="text-xs text-[#4a6080] bg-[#0d1321] border border-[#1e2d47] rounded-lg px-3 py-2 max-w-sm text-center break-all">
            {status}
          </code>
          <span className="text-xs text-[#4a6080]">Open DevTools (F12) for details</span>
        </div>
      )}
      <div ref={terminalRef} className="w-full h-full bg-[#060c14]" />
    </div>
  )
}
