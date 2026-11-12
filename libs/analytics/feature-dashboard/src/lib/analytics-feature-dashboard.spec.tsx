import { render } from '@testing-library/react';

import AnalyticsFeatureDashboard from './analytics-feature-dashboard';

describe('AnalyticsFeatureDashboard', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AnalyticsFeatureDashboard />);
    expect(baseElement).toBeTruthy();
  });
});
