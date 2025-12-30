import type { NavigationItem } from "../types/televideo";
import { createElement } from "react";

import IndexPage from "../pages/index";
import NotFoundPage from "../pages/not-found";
import NotiziePage from "../pages/200";
import GuidaTvPage from "../pages/300";
import EconomiaPage from "../pages/400";
import CulturaPage from "../pages/500";

export const navigationConfig: NavigationItem[] = [
  {
    label: "100 indice",
    color: "blue",
    rss: null,
    targetPage: 100,
    link: "/",
    component: <IndexPage />,
  },
  {
    label: "200 notizie",
    color: "yellow",
    rss: "https://www.servizitelevideo.rai.it/televideo/pub/rss101.xml",
    targetPage: 200,
    link: "/notizie",
    component: <NotiziePage />,
  },
  {
    label: "300 guida tv",
    color: "green",
    rss: "https://services.tivulaguida.it/api/epg/highlights.json",
    targetPage: 300,
    link: "/guida-tv",
    component: <GuidaTvPage />,
  },
  {
    label: "400 economia",
    color: "red",
    rss: "https://www.servizitelevideo.rai.it/televideo/pub/rss130.xml",
    targetPage: 400,
    link: "/economia",
    component: <EconomiaPage />,
  },
  {
    label: "500 cultura",
    color: "cyan",
    rss: "https://www.servizitelevideo.rai.it/televideo/pub/rss160.xml",
    targetPage: 500,
    link: "/cultura",
    component: <CulturaPage />,
  },
  {
    label: "not-found",
    color: "red",
    rss: null,
    targetPage: undefined,
    link: "/not-found",
    component: <NotFoundPage />,
  }
];

export function getNavigationItemByPage(page: number): NavigationItem | undefined {
  return navigationConfig.find((item) => item.targetPage === page);
}

export function getNavigationItemByLabel(label: string): NavigationItem | undefined {
  return navigationConfig.find((item) => item.label === label);
}

export function getAllPageNumbers(): number[] {
  return navigationConfig.map((item) => item.targetPage).filter((page): page is number => page !== undefined);
}

export function getPageComponent(page: number) {
  if (page >= 200 && page < 300) {
    return createElement(NotiziePage, { page });
  }

  if (page >= 300 && page < 400) {
    return createElement(GuidaTvPage, { page });
  }

  if (page >= 400 && page < 500) {
    return createElement(EconomiaPage, { page });
  }

  if (page >= 500 && page < 600) {
    return createElement(CulturaPage, { page });
  }

  const navigationItem = getNavigationItemByPage(page);
  if (navigationItem?.component) {
    return navigationItem.component;
  }
  return navigationConfig.find((item) => item.label === "not-found")?.component || <NotFoundPage />;
}