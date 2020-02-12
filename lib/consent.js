import { prefersReducedMotion } from './accessibility'
import { getCookie, setCookie, removeCookie } from './cookie'

const Event = {
  // order is important here
  ON_UPDATE: 'onUpdate',
  ON_VALUE_CHANGED: 'onValueChange',
  ON_ACCEPT: 'onAccept',
  ON_REJECT: 'onReject',
}

export default class CookieConsent {
  constructor(options) {
    const defaultOptions = {
      debug: false,
      name: 'cookie-consent',
      banner: document.getElementById('cookiebanner'),
      notice: document.getElementById('cookienotice'),
      linkOnly: false,
      onRejectEnd: () => {
        window.location.reload()
      },
      onAcceptEnd: (consent) => {
        const choices = consent.getChoices()
        consent.saveUserOptions({ choices })
      },
      capabilities: [
        {
          name: 'functional',
          checked: true,
          onReject: (consent) => {
            consent.removeUserOptions()
          },
          onAccept: (consent) => {
            consent.saveUserOptions({ consented: true })
          },
        },
      ],
    }

    this.options = { ...defaultOptions, ...options }
    this.queue = [] // this will hold event hooks to run in order

    if (!this.options.banner || !this.options.notice) {
      console.error('Can not find required elements!')
      return // no banner or notice present
    }

    this.button = {}
    this.button.reject = this.options.banner.querySelector('.reject')
    this.button.accept = this.options.banner.querySelector('.accept')

    if (!this.button.reject || !this.button.accept) {
      console.error('Can not find required buttons!')
      return undefined // no buttons present
    }

    this.initEvents()

    const content = this.loadUserOptions()

    // console.log(JSON.stringify(content, null, 2))

    if (content && content.choices) {
      this.setChoices(content.choices)
      this.initStartUpEvents()
    } else {
      this.initFields()
    }

    if (content && content.consented) {
      this.showNotice()
    } else {
      this.showBanner()
    }
  }

  /**
   * Sync form input fields with capabilities .
   *
   * @returns {Choice[]} passed choices
   */
  initFields() {
    const choices = this.options.capabilities.map(({ name, checked }) => ({
      name: name,
      value: checked,
    }))
    this.setChoices(choices)
    return choices
  }

  /**
   * Initial all element events.
   */
  initEvents() {
    // Reject
    this.button.reject.addEventListener('click', () => {
      if (this.options.debug) console.time('reject')
      const choices = this.initFields()
      choices.forEach((choice) => {
        const capability = this.getCapability(choice.name)
        this._runValueEventsFor(capability, choice)
        this._runEventFor(capability, Event.ON_REJECT)
      })
      this._startRunner()
      this.setChoices(choices)
      this.saveUserOptions({ choices })
      if (this.options.onRejectEnd instanceof Function) {
        this.options.onRejectEnd(this)
      }
      if (this.options.debug) console.timeEnd('reject')
      this.hideBanner()
      setTimeout(() => {
        this.showNotice()
      }, 160)
    })

    // Accept
    this.button.accept.addEventListener('click', () => {
      if (this.options.debug) console.time('accept')
      const choices = this.getChoices()
      choices.forEach((choice) => {
        const capability = this.getCapability(choice.name)
        this._runValueEventsFor(capability, choice)
        if (choice.value) {
          // is checked
          this._runEventFor(capability, Event.ON_ACCEPT)
        } else {
          this._runEventFor(capability, Event.ON_REJECT)
        }
      })
      this._startRunner()
      if (this.options.onAcceptEnd instanceof Function) {
        this.options.onAcceptEnd(this)
      }
      if (this.options.debug) console.timeEnd('accept')
      this.hideBanner()
      setTimeout(() => {
        this.showNotice()
      }, 160)
    })

    // Show banner
    this.options.notice.addEventListener('click', () => {
      this.hideNotice()
      this.showBanner()
    })
  }

  /**
   * On first load fire these events.
   */
  initStartUpEvents() {
    const choices = this.getChoices()
    choices.forEach((choice) => {
      const capability = this.getCapability(choice.name)
      if (choice.value) {
        // is checked
        this._runEventFor(capability, Event.ON_ACCEPT)
      } else {
        this._runEventFor(capability, Event.ON_REJECT)
      }
      this._startRunner()
    })
  }

  /**
   * Get our plugin options cookies content.
   */
  loadUserOptions() {
    const content = getCookie(this.options.name)
    if (!content) return null
    return content
  }

  /**
   * Save something to our plugin options cookie.
   *
   * @param {object} saveThis
   */
  saveUserOptions(saveThis) {
    const oldContent = getCookie(this.options.name)
    const newContent = { ...oldContent, ...saveThis }
    setCookie(this.options.name, newContent)
  }

  /**
   * Delete all plugin options that are saved into a cookie.
   */
  removeUserOptions() {
    if (getCookie(this.options.name)) {
      removeCookie(this.options.name)
    }
  }

  /**
   * Get single form input choice by its input name.
   *
   * @param {string} byName
   */
  getChoice(byName) {
    const node = this.options.banner.querySelector(`.choice [name="choice:${byName}"]`)

    return node.checked
  }

  /**
   * Get form input choices.
   */
  getChoices() {
    let choices = []

    this.options.banner.querySelectorAll('.choice input').forEach((node) => {
      const name = node.getAttribute('name').replace('choice:', '')
      const value = node.checked
      choices.push({ name, value })
    })

    return choices
  }

  /**
   * Set form input choices. Most likely for reseting the form.
   *
   * @param {Choice[]} choices
   */
  setChoices(choices) {
    this.options.banner.querySelectorAll('.choice input').forEach((node) => {
      const name = node.getAttribute('name').replace('choice:', '')
      const choice = choices.find((c) => c.name === name)
      if (choice) {
        node.checked = choice.value
      }
    })
  }

  /**
   * Get capability by name.
   *
   * @param {string} name
   */
  getCapability(name) {
    return this.options.capabilities.find((c) => c.name === name)
  }

  /**
   * Smoothly show an element.
   *
   * @param {HTMLElement} element
   */
  showElement(element) {
    if ('animate' in element && !prefersReducedMotion()) {
      element
        .animate([{ opacity: 0 }, { opacity: 1 }], {
          duration: 320,
          iterations: 1,
        })
        .addEventListener('finish', function onFinish() {
          element.classList.add('visible')
        })
    } else {
      element.classList.add('visible')
    }
  }

  /**
   * Smoothly hide an element.
   *
   * @param {HTMLElement} element
   */
  hideElement(element) {
    if ('animate' in element && !prefersReducedMotion()) {
      element
        .animate([{ opacity: 1 }, { opacity: 0 }], {
          duration: 160,
          iterations: 1,
        })
        .addEventListener('finish', function onFinish() {
          element.classList.remove('visible')
        })
    } else {
      element.classList.remove('visible')
    }
  }

  /**
   * Hide/Show the banner.
   */
  hideBanner() {
    this.hideElement(this.options.banner)
  }
  showBanner() {
    this.showElement(this.options.banner)
  }

  /**
   * Hide/Show the notice.
   */
  hideNotice() {
    if (!this.options.linkOnly) {
      this.hideElement(this.options.notice)
    }
  }
  showNotice() {
    if (!this.options.linkOnly) {
      this.showElement(this.options.notice)
    }
  }

  /**
   * Add a callable event function to an queue.
   *
   * @param {string} name
   * @param {function} func
   */
  _addToQueue(name, func) {
    this.queue.push({ name, func })
  }

  /**
   * Run the callable event queue.
   */
  _startRunner() {
    // loop event by order
    Object.values(Event).forEach((event) => {
      // find callables from queue with event name
      const callables = this.queue.filter((q) => q.name === event)
      // call them
      callables.forEach(({ func }) => func())
    })
    this.queue = [] // clear queue for new operations
  }

  /**
   * Run one event for one capability.
   *
   * @param {Capability} capability
   * @param {Event} withEvent
   * @param {object} params
   */
  _runEventFor(capability, withEvent, params = {}) {
    if (
      capability &&
      withEvent &&
      capability[withEvent] &&
      capability[withEvent] instanceof Function
    ) {
      this._addToQueue(withEvent, () => capability[withEvent](this, params))
      if (this.options.debug) {
        console.info(`[CookieConsent]: Added ${capability.name}.${withEvent} to queue`)
      }
    } else {
      if (this.options.debug) {
        console.warn(
          `[CookieConsent]: Capability ${capability.name} has no event of name ${withEvent}`
        )
      }
    }
  }

  /**
   * Run common or value change/update events for one capability.
   *
   * @param {Capability} capability
   * @param {Choice} withChoice
   */
  _runValueEventsFor(capability, withChoice) {
    let params = {
      choice: withChoice.value,
    }

    // on input value update
    this._runEventFor(capability, Event.ON_UPDATE, params)

    // on input value change
    const userOptions = this.loadUserOptions()
    // load saved cookie options choices if present
    if (userOptions?.choices) {
      // find current choice in saved choices
      const choice = userOptions.choices.find((c) => c.name === withChoice.name)
      // check against input choice value
      const hasChanged = withChoice.value !== choice.value
      if (hasChanged) {
        this._runEventFor(capability, Event.ON_VALUE_CHANGED, params)
      }
    }
  }
}