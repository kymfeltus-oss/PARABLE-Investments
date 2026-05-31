import { InfoIntroCinematicPage } from '@/components/investor/InfoIntroCinematicPage';
import { DEFAULT_PROJECT_SLUG } from '@/lib/pitchlock/resolve-project';

/** App entry — cinematic Parable Ecosystem intro, then flagship tenant landing. */
export default function HomePage() {
  return (
    <InfoIntroCinematicPage
      enterHref={`/${DEFAULT_PROJECT_SLUG}`}
      backHref="/guide"
      backLabel="Investor guide"
    />
  );
}
