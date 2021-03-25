import React from "react";

interface SiteData {
  name: string;
  version: string;
  repositoryUrl?: string;
  logoUrl?: string;
  readme?: string;
}

export default SiteData;

export type SiteComponent = (siteData: SiteData) => React.ReactElement;
