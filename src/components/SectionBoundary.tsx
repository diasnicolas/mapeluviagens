import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  name: string;
  children?: ReactNode;
}

/** Isolates a section: if it throws on unexpected data, it is skipped instead of breaking the page */
export class SectionBoundary extends Component<Props, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown, info: ErrorInfo) {
    console.error(`[template] ${this.props.name}:`, error, info.componentStack);
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}
