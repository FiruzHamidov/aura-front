import { ExtraPagesBanner } from '../_components/extra-pages-banner';
import MortgageCalculator from '../apartment/[slug]/_components/MortgageCalculator';

export default function Mortgage() {
  return (
    <div className="container pt-10 pb-16">
      <ExtraPagesBanner
        title="Ипотека"
        description="Планируйте покупку жилья с умом - рассчитайте ипотеку заранее и принимайте взвешенные финансовые решения."
        buttonLabel="Рассчитать ипотеку"
        buttonLink="/mortgage#calculator"
        imageUrl="/images/extra-pages/mortgage.png"
        imageAlt="Ипотека"
      />
      <MortgageCalculator id={'calculator'} propertyPrice={450000} />
    </div>
  );
}
