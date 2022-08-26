import { render, screen } from '@testing-library/angular';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  test('displays a welcome message', async () => {
    await render(AppComponent);
    const welcome = screen.getByText('Welcome');
    expect(welcome).toBeTruthy();
  });
});
