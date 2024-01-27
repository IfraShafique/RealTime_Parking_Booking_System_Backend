import express, { Request, Response, NextFunction } from 'express';
import { contactUsService, getContactUsServices } from './contactUs.services';

export const contactUsController = async(
    req: Request,
    res: Response,
    next: NextFunction
):Promise<void> => {
    try{
        const contactUs = {
            ...req.body
        }
        await contactUsService(contactUs);
        res.status(200).json({
            message: "Message sent successfully"
        })
    }catch(error){
        res.status(500).json({error: (error as any).message})
    }
}

// retrive visitor contact message
export const getContactUsController = async(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const getDetails = await getContactUsServices();
        if(!getDetails){
            res.status(404).json({message: "Np user Found"})
        }

        res.status(200).json(getDetails);
    } catch (error) {
        res.status(500).json({error: (error as any).message})
    }
}