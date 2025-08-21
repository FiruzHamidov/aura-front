import MeetTheTeam from '@/ui-components/team/team';
import { AboutUs } from './_components/about';
import { Company } from './_components/company';

export default function About() {
  return (
    <div className="mx-auto w-full max-w-[1520px] px-4 sm:px-6 lg:px-8 pt-10 md:pt-[69px] pb-14 md:pb-[116px]">
      <Company />
      <AboutUs />
      <MeetTheTeam />
    </div>
  );
}
