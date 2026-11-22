import metadata from "../../data/biography-metadata.json";
const siteData = {
 name: metadata.name, title: metadata.pages["/"].title, description: metadata.pages["/"].description,
 author: { name: "Erik Norris", email: "erik@mechanistic.com", twitter: "" },
 defaultImage: { src: "", alt: "" },
};
export default siteData;
