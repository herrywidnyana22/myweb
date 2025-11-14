// lib/fetchFullPortfolioIDN.ts

import { safeParseJSON } from "@/utils";
import { fetchSheetRaw } from "./fetchSheetRaw";

export async function fetchFullPorto() {
  // ranges — sesuaikan dengan layout sheet
  const [
    profileRows,
    addressRows,
    projectsRows,
    contactsRows,
    educationsRows,
    experiencesRows,
  ] = await Promise.all([
    fetchSheetRaw("profile!A2:I"),
    fetchSheetRaw("address!A2:E"),
    fetchSheetRaw("projects!A2:H"),
    fetchSheetRaw("contacts!A2:E"),
    fetchSheetRaw("educations!A2:F"),
    fetchSheetRaw("experiences!A2:H"),
  ]);

  // Profile: ambil baris pertama
  const profile = profileRows.length
    ? {
        type: profileRows[0][0] ?? "profile",
        name: profileRows[0][1] ?? "",
        fullName: profileRows[0][2] ?? "",
        role: profileRows[0][3] ?? "",
        summary: profileRows[0][4] ?? "",
        image: profileRows[0][5] ?? "",
        birth: {
            place: profileRows[0][6] ?? "",
            date: profileRows[0][7] ?? "",
        },
      }
    : {
        type: "profile",
        name: "",
        fullName: "",
        role: "",
        summary: "",
        image: "",
        birth: { 
            place: "",
            date: "", 
        },
      };

  const address = addressRows.length
    ? {
        type: addressRows[0][0] ?? "address",
        address: addressRows[0][1] ?? "",
        lat: addressRows[0][2] ?? "",
        lng: addressRows[0][3] ?? "",
        mapUrl: addressRows[0][4] ?? "",
      }
    : { 
        type: "address",
        address: "", 
        lat: "", 
        lng: "", 
        mapUrl: "" 
    };

  const projects = projectsRows.map((r) => ({
    type: r[0] ?? "projects",
    title: r[1] ?? "",
    description: r[2] ?? "",
    icon: r[3] ?? "",
    iconCategory: safeParseJSON(r[4]),
    progressValue: Number(r[5] ?? 0),
    demoLink: r[6] ?? "",
    githubLink: r[7] ?? "",
  }));

  const contacts = contactsRows.map((r) => ({
    type: r[0] ?? "contacts",
    title: r[1] ?? "",
    description: r[2] ?? "",
    icon: r[3] ?? "",
    href: r[4] ?? "",
  }));

  const educations = educationsRows.map((r) => ({
    type: r[0] ?? "educations",
    school: r[0] ?? "",
    major: r[1] ?? "",
    year: r[2] ?? "",
    icon: r[3] ?? "",
    subIcon: r[4] ?? "",
  }));

  const experiences = experiencesRows.map((r) => ({
    type: r[0] ?? "experiences",
    company: r[1] ?? "",
    role: r[2] ?? "",
    location: r[3] ?? "",
    year: r[4] ?? "",
    jobdesk: r[5] ?? "",
    description: r[6] ?? "",
    icon: r[7] ?? "",
  }));

  return {
    profile,
    address,
    projects,
    contacts,
    educations,
    experiences,
  };
}
