import { Page, expect } from '@playwright/test';

export class todoPage {
    constructor(private page: Page) {

    }
    async goto() {
        await this.page.goto('/dashboard');
        await expect(
            this.page.getByPlaceholder('Add a new task...'),
            'Dashboard should be visible before adding todo'
        ).toBeVisible();
    }


    async addTodo(task: string) {
        await this.page.getByPlaceholder('Add a new task...').fill(task);
        await this.page.getByRole('button', { name: '📅' }).click();
        await this.page.locator('input[type="date"]').fill('2026-01-30');
        await this.page.getByRole('button', { name: 'Add' }).click();


    }
    async todoVisible(task: string, date: string) {
        const todoItem = this.page
            .getByRole('listitem')
            .filter({ hasText: task });

        await expect(
            todoItem,
            `Todo "${task}" should appear in the list`
        ).toBeVisible();

        await expect(
            todoItem.getByText(date),
            `Todo "${task}" should show date "${date}"`
        ).toBeVisible();
    }


}
