import React from "react";

interface SiteData {
  name: string;
  version: string;
  repositoryUrl?: string;
  readme?: string;
  logoIcon?: {
    href: string;
    width: number;
    height: number;
    type: string;
  };
}

export default SiteData;

export type SiteComponent = (siteData: SiteData) => React.ReactElement;
