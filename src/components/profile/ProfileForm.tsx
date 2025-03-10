
import { PersonalInfoSection } from "./PersonalInfoSection";
import { ContactInfoSection } from "./ContactInfoSection";
import { AddressSection } from "./AddressSection";
import { OmieStatusSection } from "./OmieStatusSection";
import { TicketsSection } from "./TicketsSection";

export const ProfileForm = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <PersonalInfoSection />
      <ContactInfoSection />
      <AddressSection />
      <OmieStatusSection />
      <TicketsSection />
    </div>
  );
};
