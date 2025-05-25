import { OrganizationList } from "@clerk/nextjs";

export default function CreateOrgansizationPage() {
  return (
    <OrganizationList
      hidePersonal
      afterSelectOrganizationUrl={"/organization/:id"}
      afterCreateOrganizationUrl={"/organization/:id"}
    />
  );
}
