package org.shanoir.ng.acquisitionequipment;

import org.shanoir.ng.manufacturermodel.ManufacturerModel;

/**
 * DTO for acquisition equipments.
 * 
 * @author msimon
 *
 */
public class SimpleAcquisitionEquipmentDTO {

	private String centerName;

	private Long id;

	private ManufacturerModel manufacturerModel;

	private String serialNumber;

	/**
	 * Default constructor.
	 */
	public SimpleAcquisitionEquipmentDTO() {
	}

	/**
	 * @return the centerName
	 */
	public String getCenterName() {
		return centerName;
	}

	/**
	 * @param centerName
	 *            the centerName to set
	 */
	public void setCenterName(String centerName) {
		this.centerName = centerName;
	}

	/**
	 * @return the id
	 */
	public Long getId() {
		return id;
	}

	/**
	 * @param id
	 *            the id to set
	 */
	public void setId(Long id) {
		this.id = id;
	}

	/**
	 * @return the manufacturerModel
	 */
	public ManufacturerModel getManufacturerModel() {
		return manufacturerModel;
	}

	/**
	 * @param manufacturerModel the manufacturerModel to set
	 */
	public void setManufacturerModel(ManufacturerModel manufacturerModel) {
		this.manufacturerModel = manufacturerModel;
	}

	/**
	 * @return the serialNumber
	 */
	public String getSerialNumber() {
		return serialNumber;
	}

	/**
	 * @param serialNumber
	 *            the serialNumber to set
	 */
	public void setSerialNumber(String serialNumber) {
		this.serialNumber = serialNumber;
	}

}
