import './GrainOverlay.css';
import { isLowPerformanceDevice } from '../../utils/performance';

export function GrainOverlay() {
  const className = isLowPerformanceDevice
    ? 'grain-overlay grain-overlay--static'
    : 'grain-overlay';

  return <div className={className} aria-hidden="true" />;
}
