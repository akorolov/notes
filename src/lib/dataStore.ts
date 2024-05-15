import { persisted } from 'svelte-persisted-store'

export const contest_test = persisted("content_test", "<p>Some random content</p>")