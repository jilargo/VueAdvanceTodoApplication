import {test,expect} from '@playwright/test';
import {loginPage} from './pageObjects/loginPage';
import {SignUpPage} from './pageObjects/SignUpPage';
import {todoPage} from './pageObjects/todoPage';

const firstName = 'Junry';
const lastName = 'Largo'
const email = 'junry@gmail.com';
const password = '123456';
const confirmPassword = '123456';
const auth_path = 'storage/auth.json';


test('user can sign up, login, save auth state, and create todo',async({page}) => {
const signUpPage = new SignUpPage(page);
await signUpPage.goto();
await signUpPage.signUp(firstName, lastName, email, password, confirmPassword);

const login = new loginPage(page);
await login.goto();
await login.login(email, password);
await expect(page).toHaveURL(/dashboard/);
await login.saveAuthState(auth_path)

const addtodo = new todoPage(page);
await addtodo.goto();
await addtodo.addTodo('Buy Milk');
await addtodo.todoVisible('Buy Milk', '2026-01-30');
await addtodo.addTodo('fiesta');
await addtodo.todoVisible('fiesta', '2026-01-30');
});

