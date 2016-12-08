package org.shanoir.ng.utils;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.shanoir.ng.model.error.ErrorDetails;
import org.shanoir.ng.model.error.ErrorModel;
import org.shanoir.ng.model.error.FormError;
import org.shanoir.ng.model.exception.RestServiceException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;

/**
 * Utility class
 *
 * @author jlouis
 */
public class Utils {

	/**
	 * Convert Iterable to List
	 *
	 * @param iterable
	 * @return a list
	 */
	public static <E> List<E> toList(Iterable<E> iterable) {
		if (iterable instanceof List) {
			return (List<E>) iterable;
		}
		ArrayList<E> list = new ArrayList<E>();
		if (iterable != null) {
			for (E e : iterable) {
				list.add(e);
			}
		}
		return list;
	}


	/**
	 * Build a ready to use exception for field validation errors
	 * @param result
	 * @return
	 */
	public static RestServiceException buildValidationException(BindingResult result) {
		Map<String, List<String>> errorMap = new HashMap<String, List<String>>();
		for (ObjectError objectError : result.getAllErrors()) {
			FieldError fieldError = (FieldError) objectError;
			if (!errorMap.containsKey(fieldError.getField())) {
				errorMap.put(fieldError.getField(), new ArrayList<String>());
			}
			errorMap.get(fieldError.getField()).add(fieldError.getDefaultMessage());
		}
		return buildValidationException(errorMap);
	}


	/**
	 * Build a ready to use exception for field validation errors
	 * @param result
	 * @return
	 */
	public static RestServiceException buildValidationException(Map<String, List<String>> errors) {
		List<FormError> errorList = new ArrayList<FormError>();
		for (String fieldName : errors.keySet()) {
			List<String> codes = errors.get(fieldName);
			FormError formError = new FormError(fieldName, codes);
			errorList.add(formError);
		}
		ErrorDetails details = new ErrorDetails();
		details.setFormErrors(errorList);
		return new RestServiceException(new ErrorModel(422, "Bad arguments", details));
	}

}