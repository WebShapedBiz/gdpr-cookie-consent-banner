import { h } from 'preact'
import { useEffect } from 'preact/hooks'

import CookieConsent from '../../../lib'

import style from './style.scss'

const Banner = () => (
  <div
    id="cookiebanner2"
    className={`cookiebanner ${style.banner}`}
    aria-label="Edit your cookie settings"
    role="banner"
  >
    <div className="info">
      <div className="title">Your Cookie Controls</div>
      <div className="description">Paste some info for your users here.</div>
    </div>
    <div className="choices">
      <label className="choice" htmlFor="choice-functional">
        <input
          type="checkbox"
          name="choice:functional"
          id="choice-functional"
          checked
          disabled
        />
        <div className="name">Functional with a very long long long long long</div>
      </label>
      <label className="choice" htmlFor="choice-ga_analytics">
        <input type="checkbox" name="choice:ga_analytics" id="choice-ga_analytics" />
        <div className="name">Google Analytics</div>
        <p className="info">
          Google Tag Manager will be enabled here. Read more about it here:{' '}
          <a
            href="https://www.google.com/intl/de/tagmanager/faq.html"
            rel="noopener noreferrer"
            target="_blank"
          >
            Google Tag Manager FAQ
          </a>
        </p>
      </label>
      <label className="choice" htmlFor="choice-sa_analytics">
        <input type="checkbox" name="choice:sa_analytics" id="choice-sa_analytics" />
        <div className="name">Simple Analytics</div>
        <p className="info">
          Privacy first analytics provider. Read more here:{' '}
          <a
            href="https://docs.simpleanalytics.com/what-we-collect?ref=simpleanalytics.com"
            rel="noopener noreferrer"
            target="_blank"
          >
            Simple Analytics – What we collect
          </a>
        </p>
      </label>
    </div>
    <div className="buttons">
      <button className="reject">Reject choices</button>
      <button className="accept">Accept choices</button>
    </div>
  </div>
)

const Notice = () => (
  <div
    id="cookienotice2"
    className={`cookienotice ${style.banner}`}
    aria-label="Show the cookie settings again"
    role="button"
  >
    <img src="/assets/cookie.svg" alt="A shield which represents privacy" />
  </div>
)

const Consent2 = () => {
  useEffect(() => {
    window.consent2 = new CookieConsent({
      name: 'with-ga',
      banner: document.getElementById('cookiebanner2'),
      notice: document.getElementById('cookienotice2'),
      capabilities: [
        {
          name: 'functional',
          noOptOut: true,
        },
        {
          name: 'ga_analytics',
          onReject: () => {
            console.log('[with-ga:ga_analytics] onReject called')
            if (CookieConsent.cookie.find('_g')) {
              CookieConsent.cookie.clear('_g', window.location.host, '/')
            }
          },
          onAccept: () => {
            console.log('[with-ga:ga_analytics] onAccept called')
            // const head = document.getElementsByTagName('head')[0]
            const script = document.createElement('script')
            script.src = 'https://www.googletagmanager.com/gtag/js?id=UA-156811148-1'
            script.async = true
            script.onload = () => {
              window.dataLayer = window.dataLayer || []
              function gtag(...props) {
                window.dataLayer.push(props)
              }
              gtag('js', new Date())
              gtag('config', 'UA-156811148-1', {
                anonymize_ip: true,
              })
            }
            // head.appendChild(script)
            console.log(
              '[with-ga:sa_analytics]',
              'GA would be loaded now but is commented out'
            )
          },
        },
        {
          name: 'sa_analytics',
          checked: false,
          onReject: () => {
            console.log('[with-ga:sa_analytics] onReject called')
          },
          onAccept: () => {
            console.log('[with-ga:sa_analytics] onAccept called')
            const head = document.getElementsByTagName('head')[0]
            const script = document.createElement('script')
            script.src = 'https://cdn.simpleanalytics.io/hello.js'
            script.async = true
            script.onload = () => {
              console.log('[with-ga:sa_analytics] script fully loaded')
            }
            head.appendChild(script)
          },
        },
      ],
    })
  }, [])

  return [<Banner key="banner" />, <Notice key="notice" />]
}

export default Consent2
