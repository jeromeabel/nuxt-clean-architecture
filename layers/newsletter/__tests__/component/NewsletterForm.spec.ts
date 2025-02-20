// @vitest-environment nuxt
import { describe, it, expect, beforeEach } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import { flushPromises, mount } from '@vue/test-utils'
import NewsletterForm from '../../components/NewsletterForm.vue'
import { SUCCESS } from '../../composables/useNewsletter'
import { EMAIL_ERRORS } from '~/shared/email'

describe('NewsletterForm', () => {
  let wrapper: VueWrapper

  beforeEach(() => {
    // The component uses Input, Button From Shadcn/ui
    // We need mount (or mountSuspended) instead of shallow mount
    // Nuxt testing environment
    wrapper = mount(NewsletterForm)
  })

  // Helpers
  const findForm = () => wrapper.find('[data-testid="newsletter-form"]')
  const findEmailInput = () => wrapper.find('[data-testid="newsletter-email"]')
  const findSubmitButton = () => wrapper.find('[data-testid="newsletter-submit"]')
  const findMessage = () => wrapper.find('[data-testid="newsletter-message"]')

  it('should render the form correctly', () => {
    expect(findForm().exists()).toBe(true)
    expect(findEmailInput().exists()).toBe(true)
    expect(findSubmitButton().exists()).toBe(true)
    expect(findMessage().exists()).toBe(true)
  })

  it('should disable the button when email field is empty and enables when filled', async () => {
    await findEmailInput().setValue('')
    expect(findSubmitButton().attributes('disabled')).toBeDefined() // disabled = true

    await findEmailInput().setValue('not empty')
    expect(findSubmitButton().attributes('disabled')).toBeUndefined() // disabled = false
  })

  it('should have required attribute on email input', () => {
    expect(findEmailInput().attributes('required')).toBeDefined()
  })

  describe('on form submit, when username and password are filled', () => {
    it.skip('should render an error message on invalid email', async () => {
      await findEmailInput().setValue('invalid-email')
      expect(findMessage().text()).toBe('')
      await findForm().trigger('submit')
      expect(findEmailInput().classes()).toContain('border-error')
      expect(findMessage().text()).toBe(EMAIL_ERRORS.INVALID)
    })

    it.skip('should render a success message on valid email', async () => {
      await findEmailInput().setValue('valid@example.com')
      await findForm().trigger('submit')
      await flushPromises()
      expect(findEmailInput().classes()).toContain('border-success')
      expect(findMessage().text()).toBe(SUCCESS)
    })
  })
})
