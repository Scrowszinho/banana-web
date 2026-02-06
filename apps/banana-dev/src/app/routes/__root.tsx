import { createRootRoute } from '@tanstack/react-router';
import { Scene } from '../animation';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return <Scene />;
}
