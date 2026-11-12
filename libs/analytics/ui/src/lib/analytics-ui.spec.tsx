import { render } from '@testing-library/react';

import AnalyticsUi from './analytics-ui';

describe('AnalyticsUi', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AnalyticsUi />);
    expect(baseElement).toBeTruthy();
  });
});
