import { defineQuery } from "next-sanity";

const imageFragment = `{"asset": asset->{_id, url, metadata{dimensions}, originalFilename}, hotspot}`;
const imageWithAltFragment = `{"asset": asset->{_id, url, metadata{dimensions}, originalFilename}, hotspot, alt}`;
const postalAddressFragment = `{street, postalCode, locality, province, country}`;
const paragraphs = (field: string) => field; // array-of-text fields project as-is

export const SITE_QUERY = defineQuery(`{
  "siteSettings": *[_type == "siteSettings"][0]{
    brandName,
    "logo": logo${imageFragment},
    locationCity,
    locationCountry,
    publicationApproved,
    approvedBy,
    approvedOn
  },
  "companyInfo": *[_type == "companyInfo"][0]{
    shortIntro,
    ${paragraphs("history")},
    ${paragraphs("team")},
    ${paragraphs("workingApproach")},
    certifications,
    serviceSectors,
    serviceArea,
    brands
  },
  "contactInfo": *[_type == "contactInfo"][0]{
    customerPhone,
    customerWhatsapp,
    customerEmail,
    "customerAddress": customerAddress${postalAddressFragment},
    customerMapUrl,
    openingHours[]{days, hours},
    recruitmentSameAsCustomer,
    recruitmentPhone,
    recruitmentWhatsapp,
    recruitmentEmail,
    recruitmentWhatsappMessage,
    recruitmentEmailSubject,
    recruitmentEmailBody
  },
  "legalInfo": *[_type == "legalInfo"][0]{
    legalName,
    taxId,
    "registeredAddress": registeredAddress${postalAddressFragment},
    registryDetails,
    legalEmail,
    dataControllerName,
    "dataControllerAddress": dataControllerAddress${postalAddressFragment},
    dataControllerEmail,
    rightsContact,
    termsOfUse,
    intellectualProperty,
    applicableLaw,
    purposes,
    recipients,
    legalBases,
    retentionPeriods,
    lastReviewed,
    reviewed
  },
  "homePage": *[_type == "homePage"][0]{
    heroEyebrow, heroHeadline, heroSubtext, primaryCtaLabel, secondaryCtaLabel
  },
  "servicesPage": *[_type == "servicesPage"][0]{
    heroEyebrow, heroHeading, heroIntroPara1, heroIntroPara2
  },
  "recruitmentPage": *[_type == "recruitmentPage"][0]{
    heroEyebrow, heroHeadline, heroSubtext, primaryCtaLabel, secondaryCtaLabel
  },
  "enDetallePage": *[_type == "enDetallePage"][0]{
    introText,
    experienceHeading, experienceBody, archiveNote,
    "overviewImage": overviewImage${imageWithAltFragment},
    step1Heading, step1Body, "step1Image": step1Image${imageWithAltFragment},
    step2Heading, step2Body,
    "step2ImageA": step2ImageA${imageWithAltFragment},
    "step2ImageB": step2ImageB${imageWithAltFragment},
    step2BodyExtra,
    "step2ImageC": step2ImageC${imageWithAltFragment},
    "step2ImageD": step2ImageD${imageWithAltFragment},
    step3Heading, step3Body, "step3Image": step3Image${imageWithAltFragment},
    closingText
  },
  "seoSettings": *[_type == "seoSettings"][0]{
    home, servicios, sobreOltenia, trabajaConNosotros, contacto
  },
  "teamMembers": *[_type == "teamMember"] | order(order asc) {
    name, role, ${paragraphs("bio")}, "photo": photo${imageWithAltFragment}
  },
  "services": *[_type == "service"] | order(order asc) {
    serviceId, name, summary, activities, details, "photo": photo${imageWithAltFragment}
  },
  "vacancies": *[_type == "vacancy"] {
    "id": slug.current,
    status, title, datePosted, validThrough, location, summary,
    responsibilities, requiredExperience, requiredQualifications,
    drivingLicence, schedule, contractType, salaryRange, benefits, applicationInstructions
  },
  "photos": *[_type == "photo"] | order(order asc) {
    "asset": image.asset->{_id, url, metadata{dimensions}, originalFilename},
    "hotspot": image.hotspot,
    alt, caption, publicationApproved, collection, isHistoricalArchive
  },
  "careerStages": *[_type == "careerStage"] | order(order asc) {
    "id": _id,
    title, subtitle, description, responsibilities, competencies, quote, note,
    relatedContent[]{label, href}, order
  }
}`);
