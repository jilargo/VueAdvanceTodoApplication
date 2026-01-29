import { Page } from '@playwright/test';
import  path  from 'path';

export class SignUpPage{
    constructor( private page: Page){}

async goto(){
    await this.page.goto('/signup');
}

async signUp(firstName: string, lastName: string, email: string, password: string, confirmPassword: string,profilePicturePath?: string){
await this.page.getByPlaceholder('First Name').fill(firstName);
await this.page.getByPlaceholder('Last Name').fill(lastName);
await this.page.getByPlaceholder('Email').fill(email);
await this.page.getByPlaceholder('Password', {exact: true}).fill(password);
await this.page.getByPlaceholder('Confirm Password',{exact: true}).fill(password);

//for file uploads
const filePath = path.resolve(__dirname, '../fixtures/profile.jpg');
await this.page.locator('input[type="file"]').setInputFiles(filePath);
  await this.page.getByRole('button', { name: 'Register' }).click();
}
}






