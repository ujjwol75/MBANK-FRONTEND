import { nanoid } from "nanoid";
import { lazy } from "react";

const Customer = lazy(() => import("../scenes/customer"));
const Leads = lazy(() => import("../scenes/leads"));
const ChannelPartners = lazy(() => import("../scenes/channelPartners"));
const Form = lazy(() => import("../scenes/form"));
const FAQ = lazy(() => import("../scenes/faq"));
const Geography = lazy(() => import("../scenes/geography"));

const Dashboard = lazy(() => import("../scenes/dashboard"));
export const routes = [
  { path: "/", component: <Dashboard />, id: nanoid() },
  { path: "/customers", component: <Customer />, id: nanoid() },
  { path: "/leads", component: <Leads />, id: nanoid() },
  { path: "/channel-partners", component: <ChannelPartners />, id: nanoid() },
  // { path: "/form", component: <Form />, id: nanoid() },
  // { path: "/faq", component: <FAQ />, id: nanoid() },
  // { path: "/geography", component: <Geography />, id: nanoid() },
  // { path: "/contacts", component: <Geography />, id: nanoid() },
];
