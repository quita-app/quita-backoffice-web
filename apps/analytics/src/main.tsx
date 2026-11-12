import { StrictMode } from 'react';
import { createRoot, Root } from 'react-dom/client';
import App from './app/app';
import styles from './styles.css?inline';

class QuitaAnalytics extends HTMLElement {
  private root?: Root;
  private mount?: HTMLDivElement;

  connectedCallback() {
    if (!this.shadowRoot) {
      const shadow = this.attachShadow({ mode: 'open' });
      // the page's CSS does not cross the shadow boundary: the panel brings its own
      const style = document.createElement('style');
      style.textContent = styles;
      this.mount = document.createElement('div');
      shadow.append(style, this.mount);
    }

    this.root = createRoot(this.mount as HTMLDivElement);
    this.root.render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
  }

  disconnectedCallback() {
    // left the page: unmount React, or every visit would leave a live tree behind
    this.root?.unmount();
    this.root = undefined;
  }
}

// registering twice throws, so guard it
if (!customElements.get('quita-analytics')) {
  customElements.define('quita-analytics', QuitaAnalytics);
}
