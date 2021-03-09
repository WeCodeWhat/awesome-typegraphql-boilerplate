import * as yup from "yup";

export const sharedSchema = {
	email: yup.string().email(),
	password: yup.string().min(3).max(255),
};

export const YUP_UUID = yup.object().shape({
	id: yup.string().uuid(`Your id is not an uuid`),
});
