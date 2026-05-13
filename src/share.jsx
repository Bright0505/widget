import React from 'react'
import QRCode from 'qrcode'

function encodeShareData(data) {
  try {
    const json = JSON.stringify(data)
    const b64 = btoa(unescape(encodeURIComponent(json)))
    return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
  } catch { return '' }
}

function decodeShareData(str) {
  try {
    const pad = str + '=='.slice(0, (4 - str.length % 4) % 4)
    const b64 = pad.replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(decodeURIComponent(escape(atob(b64))))
  } catch { return null }
}

export function parseShareFromUrl() {
  const m = window.location.hash.match(/[#&]share=([^&]*)/)
  return m ? decodeShareData(m[1]) : null
}

function buildShareUrl(data) {
  const base = window.location.origin + window.location.pathname
  return base + '#share=' + encodeShareData(data)
}

export function ShareModal({ data, title: defaultTitle = '', onClose }) {
  const [qrSrc, setQrSrc] = React.useState('')
  const [copied, setCopied] = React.useState(false)
  const [userTitle, setUserTitle] = React.useState(defaultTitle)
  const [downloadStatus, setDownloadStatus] = React.useState('idle') // idle | loading | success | error
  const url = buildShareUrl(data)

  React.useEffect(() => {
    QRCode.toDataURL(url, { width: 220, margin: 2 }).then(setQrSrc).catch(() => {})
  }, [url])

  const copy = () => {
    navigator.clipboard?.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const download = () => {
    if (!qrSrc) return
    setDownloadStatus('loading')
    const img = new Image()
    img.onload = () => {
      try {
        const pad = 24
        const fontSize = 15
        const gap = 14
        const titleText = userTitle.trim()
        const dlCanvas = document.createElement('canvas')
        const titleH = titleText ? gap + fontSize + 8 : 0
        dlCanvas.width = img.width + pad * 2
        dlCanvas.height = img.height + pad + titleH + pad
        const ctx = dlCanvas.getContext('2d')
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, dlCanvas.width, dlCanvas.height)
        ctx.drawImage(img, pad, pad)
        if (titleText) {
          ctx.fillStyle = '#1a1a1a'
          ctx.font = `600 ${fontSize}px -apple-system, "SF Pro Text", system-ui, sans-serif`
          ctx.textAlign = 'center'
          ctx.fillText(titleText, dlCanvas.width / 2, img.height + pad + gap + fontSize - 2)
        }
        dlCanvas.toBlob(blob => {
          const a = document.createElement('a')
          a.href = URL.createObjectURL(blob)
          a.download = (titleText || 'qrcode') + '.png'
          a.click()
          URL.revokeObjectURL(a.href)
          setDownloadStatus('success')
          setTimeout(() => setDownloadStatus('idle'), 2000)
        })
      } catch (err) {
        setDownloadStatus('error')
        setTimeout(() => setDownloadStatus('idle'), 2000)
      }
    }
    img.onerror = () => {
      setDownloadStatus('error')
      setTimeout(() => setDownloadStatus('idle'), 2000)
    }
    img.src = qrSrc
  }

  return (
    <div className="share-overlay" onClick={onClose}>
      <div className="share-card" onClick={e => e.stopPropagation()}>
        <div className="share-head">
          <span className="share-title">分享</span>
          <button className="share-close" onClick={onClose}>✕</button>
        </div>
        <p className="share-hint">掃描 QR Code 或複製連結</p>
        <div className="share-qr-wrap">
          {qrSrc
            ? <img src={qrSrc} alt="QR Code" className="share-qr"/>
            : <div className="share-qr-ph"/>
          }
          {userTitle.trim() && <p className="share-qr-label">{userTitle.trim()}</p>}
        </div>
        <input
          className="share-title-input"
          type="text"
          placeholder="加入標題（選填）"
          value={userTitle}
          onChange={e => setUserTitle(e.target.value)}
          maxLength={40}
        />
        <button
          className="btn-primary"
          style={{width:'100%'}}
          onClick={download}
          disabled={!qrSrc || downloadStatus !== 'idle'}
        >
          {downloadStatus === 'idle' && '下載 QR Code'}
          {downloadStatus === 'loading' && '正在下載...'}
          {downloadStatus === 'success' && '下載完成 ✓'}
          {downloadStatus === 'error' && '下載失敗'}
        </button>
        <button className="btn-secondary" style={{width:'100%'}} onClick={copy}>
          {copied ? '已複製連結 ✓' : '複製連結'}
        </button>
      </div>
    </div>
  )
}
