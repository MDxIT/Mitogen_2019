import junit.framework.Test;
import junit.framework.TestSuite;

public class MicroArray_Suite {

	public static Test suite() {
		TestSuite suite = new TestSuite();
		suite.addTestSuite(new_microarray_req.class);
		suite.addTestSuite(QC_Req.class);
		suite.addTestSuite(ReceiveSample.class);
		suite.addTestSuite(AssignSpecimenMethod_microarray.class);
		suite.addTestSuite(processSpecimens.class);
		suite.addTestSuite(Extraction_extractDNA.class);
		suite.addTestSuite(micro_BatchCreation.class);
		suite.addTestSuite(micro_QuantExtraction.class);
		suite.addTestSuite(micro_NormalizeExtraction.class);
		suite.addTestSuite(micro_Digest.class);
		suite.addTestSuite(micro_Ligate.class);
		return suite;
	}

	public static void main(String[] args) {
		junit.textui.TestRunner.run(suite());
	}
}
