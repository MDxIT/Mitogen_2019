import junit.framework.Test;
import junit.framework.TestSuite;

public class CultureTestSuite {

  public static Test suite() {
    TestSuite suite = new TestSuite();
    suite.addTestSuite(Culture_NewReq.class);
    suite.addTestSuite(Culture_QC_Req.class);
    suite.addTestSuite(Culture_ReceiveSpecimens.class);
    suite.addTestSuite(Culture_AssignSpecimens.class);
    suite.addTestSuite(Culture_ProcessSpecimens.class);
    suite.addTestSuite(Culture_Setup.class);
    suite.addTestSuite(Culture_Status.class);
    suite.addTestSuite(Culture_harvestCells.class);
    return suite;
  }

  public static void main(String[] args) {
    junit.textui.TestRunner.run(suite());
  }
}
