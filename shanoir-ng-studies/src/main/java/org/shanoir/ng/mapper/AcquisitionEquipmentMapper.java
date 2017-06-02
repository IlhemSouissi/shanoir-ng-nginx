package org.shanoir.ng.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.shanoir.ng.acquisitionequipment.AcquisitionEquipment;
import org.shanoir.ng.acquisitionequipment.AcquisitionEquipmentDTO;

/**
 * Mapper for acquisition equipments.
 * 
 * @author msimon
 *
 */
@Mapper(componentModel = "spring", uses = CenterMapper.class)
public interface AcquisitionEquipmentMapper {

	/**
	 * Map list of @AcquisitionEquipment to list of @AcquisitionEquipmentDTO.
	 * 
	 * @param acquisitionEquipments
	 *            list of acquisition equipments.
	 * @return list of acquisition equipments DTO.
	 */
	List<AcquisitionEquipmentDTO> acquisitionEquipmentsToAcquisitionEquipmentDTOs(List<AcquisitionEquipment> acquisitionEquipments);

	/**
	 * Map a @AcquisitionEquipment to a @AcquisitionEquipmentDTO.
	 * 
	 * @param acquisitionEquipment
	 *            acquisition equipment to map.
	 * @return acquisition equipment DTO.
	 */
	AcquisitionEquipmentDTO acquisitionEquipmentToAcquisitionEquipmentDTO(AcquisitionEquipment acquisitionEquipment);

}
