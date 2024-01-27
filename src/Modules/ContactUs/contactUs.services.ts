import { IContactUs, ContactUsModel } from "./contactUs.model";

// add user message
export const contactUsService = async (contactUs: IContactUs): Promise<void> => {
  try {
    const newContactUs = new ContactUsModel(contactUs);
    await newContactUs.save();
  } catch (error) {
    throw error;
  }
};

// retrive the contact message
export const getContactUsServices = async () => {
  try {
      const user = await ContactUsModel.find();
      return user;
  } catch (error) {
      throw error;
  }
}