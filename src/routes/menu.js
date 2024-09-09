import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import { nanoid } from "nanoid";
export const menu = [
  {
    title: "Dashboard",
    path: "/",
    icon: <HomeOutlinedIcon />,
    submenus: [],
    id: nanoid(),
  },
  {
    title: "Customers",
    path: "/customers",
    icon: <PeopleOutlinedIcon />,
    submenus: [],
    id: nanoid(),
  },
  {
    title: "Leads",
    path: "/leads",
    icon: <ContactsOutlinedIcon />,
    submenus: [],
    id: nanoid(),
  },
  {
    title: "Channel Partners",
    path: "/channel-partners",
    icon: <ReceiptOutlinedIcon />,
    submenus: [],
    id: nanoid(),
  },
  // {
  //   title: "Form",
  //   path: "/form",
  //   icon: <PersonOutlinedIcon />,
  //   submenus: [],
  //   id: nanoid(),
  // },
  // {
  //   title: "FAQ",
  //   path: "/faq",
  //   icon: <HelpOutlineOutlinedIcon />,
  //   submenus: [],
  //   id: nanoid(),
  // },
  // {
  //   title: "Geography",
  //   path: "/geography",
  //   icon: <MapOutlinedIcon />,
  //   submenus: [],
  //   id: nanoid(),
  // },
];
