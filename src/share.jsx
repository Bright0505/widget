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

export function ShareModal({ data, onClose }) {
  const [qrSrc, setQrSrc] = React.useState('')
  const [copied, setCopied] = React.useState(false)
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

  return (
    <div className="share-overlay" onClick={onClose}>
      <div className="share-card" onClick={e => e.stopPropagation()}>
        <div className="share-head">
          <span className="share-title">分享</span>
          <button className="share-close" onClick={onClose}>✕</button>
        </div>
        <p className="share-hint">掃描 QR Code 或複製連結</p>
        {qrSrc
          ? <img src={qrSrc} alt="QR Code" className="share-qr"/>
          : <div className="share-qr-ph"/>
        }
        <button className="btn-primary" style={{width:'100%'}} onClick={copy}>
          {copied ? '已複製連結 ✓' : '複製連結'}
        </button>
      </div>
    </div>
  )
}
