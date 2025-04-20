import MeetTheTeam from '@/ui-components/team/team';
import { AboutUs } from './_components/about';
import { Company } from './_components/company';

export default function About() {
  return (
    <div className="container pt-[69px] pb-[116px]">
      <Company />
      <AboutUs />
      <MeetTheTeam />
    </div>
  );
}
