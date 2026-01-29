import { Page } from '@playwright/test';

export class loginPage {
    constructor(private page: Page) { }

    async goto() {
        await this.page.goto('/login');
    }

    async login(email: string, password: string) {
        await this.page.getByPlaceholder('Email').fill(email);
        await this.page.getByPlaceholder('Password').fill(password);
        //await this.page.getByRole('button', { name: 'Login' }).click();
    await Promise.all([
        this.page.waitForURL('**/dashboard'),
        this.page.getByRole('button', { name: 'Login' }).click(),
    ])
    }
    async saveAuthState(path: string) {
    await this.page.context().storageState({ path });
  }
}