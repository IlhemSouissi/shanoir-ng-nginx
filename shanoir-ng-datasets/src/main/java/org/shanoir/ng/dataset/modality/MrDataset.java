package org.shanoir.ng.dataset.modality;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;

import org.shanoir.ng.dataset.Dataset;
import org.shanoir.ng.shared.model.DiffusionGradient;
import org.shanoir.ng.shared.model.EchoTime;
import org.shanoir.ng.shared.model.FlipAngle;
import org.shanoir.ng.shared.model.InversionTime;
import org.shanoir.ng.shared.model.RepetitionTime;

/**
 * MR dataset.
 * 
 * @author msimon
 *
 */
@Entity
public class MrDataset extends Dataset {

	/**
	 * UID
	 */
	private static final long serialVersionUID = 6801936202135911035L;

	/** list Diffusion gradients. */
	@OneToMany(fetch = FetchType.LAZY, mappedBy = "mrDataset", cascade = CascadeType.ALL)
	private List<DiffusionGradient> diffusionGradients;

	/** Echo time. */
	@ManyToOne
	@JoinColumn(name = "echo_time_id")
	private EchoTime echoTime;

	/** Flip angle. */
	@ManyToOne
	@JoinColumn(name = "flip_angle_id")
	private FlipAngle flipAngle;

	/** Inversion time. */
	@ManyToOne
	@JoinColumn(name = "inversion_time_id")
	private InversionTime inversionTime;

	/** Mr Quality procedure. */
	private Integer mrQualityProcedureType;

	/** Origin metadata. */
	@OneToOne
	private MrDatasetMetadata originMrMetadata;

	/** Repetition time. */
	@ManyToOne
	@JoinColumn(name = "repetition_time_id")
	private RepetitionTime repetitionTime;

	/** Metadata updated by study card. */
	@OneToOne
	private MrDatasetMetadata updatedMrMetadata;

	/**
	 * @return the diffusionGradients
	 */
	public List<DiffusionGradient> getDiffusionGradients() {
		return diffusionGradients;
	}

	/**
	 * @param diffusionGradients
	 *            the diffusionGradients to set
	 */
	public void setDiffusionGradients(List<DiffusionGradient> diffusionGradients) {
		this.diffusionGradients = diffusionGradients;
	}

	/**
	 * @return the echoTime
	 */
	public EchoTime getEchoTime() {
		return echoTime;
	}

	/**
	 * @param echoTime
	 *            the echoTime to set
	 */
	public void setEchoTime(EchoTime echoTime) {
		this.echoTime = echoTime;
	}

	/**
	 * @return the flipAngle
	 */
	public FlipAngle getFlipAngle() {
		return flipAngle;
	}

	/**
	 * @param flipAngle
	 *            the flipAngle to set
	 */
	public void setFlipAngle(FlipAngle flipAngle) {
		this.flipAngle = flipAngle;
	}

	/**
	 * @return the inversionTime
	 */
	public InversionTime getInversionTime() {
		return inversionTime;
	}

	/**
	 * @param inversionTime
	 *            the inversionTime to set
	 */
	public void setInversionTime(InversionTime inversionTime) {
		this.inversionTime = inversionTime;
	}

	/**
	 * @return the mrQualityProcedureType
	 */
	public MrQualityProcedureType getMrQualityProcedureType() {
		return MrQualityProcedureType.getType(mrQualityProcedureType);
	}

	/**
	 * @param mrQualityProcedureType
	 *            the mrQualityProcedureType to set
	 */
	public void setMrQualityProcedureType(MrQualityProcedureType mrQualityProcedureType) {
		if (mrQualityProcedureType == null) {
			this.mrQualityProcedureType = null;
		} else {
			this.mrQualityProcedureType = mrQualityProcedureType.getId();
		}
	}

	/**
	 * @return the originMrMetadata
	 */
	public MrDatasetMetadata getOriginMrMetadata() {
		return originMrMetadata;
	}

	/**
	 * @param originMrMetadata
	 *            the originMrMetadata to set
	 */
	public void setOriginMrMetadata(MrDatasetMetadata originMrMetadata) {
		this.originMrMetadata = originMrMetadata;
	}

	/**
	 * @return the repetitionTime
	 */
	public RepetitionTime getRepetitionTime() {
		return repetitionTime;
	}

	/**
	 * @param repetitionTime
	 *            the repetitionTime to set
	 */
	public void setRepetitionTime(RepetitionTime repetitionTime) {
		this.repetitionTime = repetitionTime;
	}

	@Override
	public String getType() {
		return "Mr";
	}

	/**
	 * @return the updatedMrMetadata
	 */
	public MrDatasetMetadata getUpdatedMrMetadata() {
		return updatedMrMetadata;
	}

	/**
	 * @param updatedMrMetadata
	 *            the updatedMrMetadata to set
	 */
	public void setUpdatedMrMetadata(MrDatasetMetadata updatedMrMetadata) {
		this.updatedMrMetadata = updatedMrMetadata;
	}

}