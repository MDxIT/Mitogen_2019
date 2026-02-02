DELIMITER ;;

DROP PROCEDURE IF EXISTS `sp_getAnalysisTableData`;;

CREATE PROCEDURE `sp_getAnalysisTableData`( 
  IN pStep VARCHAR(80),
  IN pParentId VARCHAR(80),
  IN pTableType VARCHAR(80),
  IN pControlType VARCHAR(80)
)
BEGIN

  
  DECLARE v_finished INTEGER DEFAULT 0;
  DECLARE v_dataDefId INT(11) DEFAULT NULL;
  DECLARE v_dataDefDataType VARCHAR(80) DEFAULT '';
  DECLARE v_dataDefDefinerType VARCHAR(80) DEFAULT '';
  DECLARE v_dataDefSigFig VARCHAR(80) DEFAULT '';
  DECLARE v_dataDefDataLabel VARCHAR(80) DEFAULT '';
  
  DECLARE v_limitJson VARCHAR(1000) DEFAULT '';
  DECLARE v_limitId INT(11) DEFAULT NULL;
  DECLARE v_units VARCHAR(80) DEFAULT '';
  DECLARE v_interpretationJson VARCHAR(2000) DEFAULT '';
  
  
  DECLARE cursor_samplesOnQueue CURSOR FOR 
    SELECT
      x.id,
      x.dataType,
      x.definerType,
      x.sigFig,
      x.`value` FROM (SELECT 
      adefLoad.id
      , adefLoad.dataType
      , adef.definerType
      , adefLoad.sigFig
      , adefLoad.`value`
      , adef.sequence
    FROM analysisMethods am
      INNER JOIN analysisMethodVersions amv
        ON am.id = amv.analysisMethodsId
      INNER JOIN analysisDataDefinition adef
        ON amv.id = adef.analysisMethodVersionsId
      INNER JOIN analysisDataDefinition adefLoad 
        ON adef.loadDataAnalysisDataDefinitionId = adefLoad.id
    WHERE am.analysisStepName = pStep
      AND amv.active = 1
      AND adef.definerType = 'loadData'
    UNION SELECT 
      adef.id
      , adef.dataType
      , adef.definerType
      , adef.sigFig
      , adef.`value`
      , adef.sequence
    FROM analysisMethods am
    INNER JOIN analysisMethodVersions amv
      ON am.id = amv.analysisMethodsId
    INNER JOIN analysisDataDefinition adef
      ON amv.id = adef.analysisMethodVersionsId
    WHERE am.analysisStepName = pStep
      AND amv.active = 1
      AND adef.definerType = 'data'
    UNION SELECT 
      adef.id
      , 'varchar'
      , adef.definerType
      , NULL
      , fis.screenLabel
      , adef.sequence
    FROM analysisMethods am
    INNER JOIN analysisMethodVersions amv
      ON am.id = amv.analysisMethodsId
    INNER JOIN analysisDataDefinition adef
      ON amv.id = adef.analysisMethodVersionsId
    INNER JOIN formInputSettings fis
        ON adef.formInputSettingsId = fis.id
    WHERE am.analysisStepName = pStep
      AND amv.active = 1
      AND adef.definerType = 'metaData'
      AND pTableType = 'data'
) x
    ORDER BY CASE x.definerType 
          WHEN 'metaData' THEN 1
                WHEN 'loadData' THEN 2
                WHEN 'data' THEN 3
                ELSE 4
              END, x.sequence;
              
  DECLARE CONTINUE HANDLER 
    FOR NOT FOUND SET v_finished = 1;
    
      
  OPEN cursor_samplesOnQueue;
  
          
  SET @json = JSON_OBJECT();
  
  getDataForSampleColumns: LOOP 
    
    FETCH next FROM cursor_samplesOnQueue INTO v_dataDefId, v_dataDefDataType, v_dataDefDefinerType, v_dataDefSigFig, v_dataDefDataLabel;
  
    
     IF v_finished = 1 THEN 
      LEAVE getDataForSampleColumns;
      END IF; 
      
      

    SET v_limitId = (
                      SELECT id 
                      FROM analysisDataLimits
                      WHERE analysisDataDefinitionId = v_dataDefId
                    );
    SET v_units = (
                      SELECT units 
                      FROM analysisDataDefinition
                      WHERE id = v_dataDefId
                    );
    
        
    IF IFNULL(v_limitId,'') <> '' THEN
    IF v_dataDefDataType = 'decimal' THEN
      SELECT JSON_OBJECT(
                          'limitsId', v_limitId,
                          'units', v_units,
                          'lowerLimit', ROUND(lowerLimit, v_dataDefSigFig),
                          'upperLimit', ROUND(upperLimit, v_dataDefSigFig),
                          'discrete', ROUND(discrete, v_dataDefSigFig),
                          'displayLimit', CASE IFNULL(lowerLimit,'') 
                                            WHEN '' THEN CONCAT('Target: ',ROUND(discrete, v_dataDefSigFig))
                                            WHEN upperLimit THEN CONCAT('Threshold: ', ROUND(lowerLimit, v_dataDefSigFig))
                                            ELSE CONCAT('Range: ', ROUND(lowerLimit, v_dataDefSigFig), ' - ', ROUND(upperLimit, v_dataDefSigFig))
                                          END
                        ) INTO v_limitJson
      FROM analysisDataLimits
      WHERE analysisDataDefinitionId = v_dataDefId;
            
      ELSEIF v_dataDefDataType = 'dateTime' THEN
        SELECT JSON_OBJECT(
                            'limitsId', v_limitId,
                            'units', v_units,
                            'lowerLimit', lowerLimit,
                            'upperLimit', upperLimit,
                            'discrete', discrete,
                            'displayLimit', CASE IFNULL(lowerLimit,'') 
                                              WHEN '' THEN CONCAT('Target: ', lowerLimit)
                                              WHEN upperLimit THEN CONCAT('Threshold: ', lowerLimit)
                                              ELSE CONCAT('Range: ', lowerLimit, ' - ', upperLimit)
                                            END
                            )  INTO v_limitJson
        FROM analysisDataLimits
        WHERE analysisDataDefinitionId = v_dataDefId;
  
                            
      ELSEIF v_dataDefDataType = 'varchar' THEN
        SELECT JSON_OBJECT(
                            'limitsId', v_limitId,
                            'units', v_units,
                            'lowerLimit', lowerLimit,
                            'upperLimit', upperLimit,
                            'discrete', discrete,
                            'displayLimit',CONCAT('Target: ', discrete),
                            'definerType', v_dataDefDefinerType
                          ) INTO v_limitJson
        FROM analysisDataLimits
        WHERE analysisDataDefinitionId = v_dataDefId;    
      ELSE
        SELECT JSON_OBJECT('displayLimit','') INTO v_limitJson;
      END IF;   
      
        
      
      SELECT JSON_OBJECT(
                          'interpretationId', aint.id,
                          'belowLower', JSON_OBJECT('interpretation',aint.belowLower, 'cssClass', aintcss.belowLower),
                          'equalLower', JSON_OBJECT('interpretation',aint.equalLower, 'cssClass', aintcss.equalLower),
                          'betweenLowerUpper', JSON_OBJECT('interpretation',aint.betweenLowerUpper, 'cssClass', aintcss.betweenLowerUpper),
                          'equalUpper', JSON_OBJECT('interpretation',aint.equalUpper, 'cssClass', aintcss.equalUpper),
                          'aboveUpper', JSON_OBJECT('interpretation',aint.aboveUpper, 'cssClass', aintcss.aboveUpper),
                          'equalDiscrete', JSON_OBJECT('interpretation',aint.equalDiscrete, 'cssClass', aintcss.equalDiscrete),
                          'notEqualDiscrete', JSON_OBJECT('interpretation',aint.notEqualDiscrete, 'cssClass', aintcss.notEqualDiscrete)
                        ) INTO v_interpretationJson
        FROM analysisDataInterpretation aint
          LEFT JOIN analysisDataInterpretationCSSClass aintcss
            ON aint.id = aintcss.analysisDataInterpretationId
        WHERE aint.analysisDataLimitsId = v_limitId;
        
        IF IFNULL(v_interpretationJson,'') = '' THEN
          SELECT JSON_OBJECT(
                              'dataDefId', v_dataDefId, 
                              'dataColumnLabel',v_dataDefDataLabel, 
                              'dataType', v_dataDefDataType,
                              'limits', CAST(v_limitJson AS JSON)
                            ) into @columnMeta;
        ELSE 
          SELECT JSON_OBJECT(
                              'dataDefId', v_dataDefId, 
                              'dataColumnLabel',v_dataDefDataLabel, 
                              'dataType', v_dataDefDataType,
                              'limits', CAST(v_limitJson AS JSON), 
                              'interpretation', CAST(v_interpretationJson AS JSON),
                              'definerType', v_dataDefDefinerType
                            ) into @columnMeta;
        END IF;
      ELSE 
        
        SELECT JSON_OBJECT(
                            'dataDefId', v_dataDefId, 
                            'dataColumnLabel',v_dataDefDataLabel, 
                            'dataType', v_dataDefDataType,
                            'definerType', v_dataDefDefinerType
                          ) into @columnMeta;
      
      END IF;
      
        
            
      SET @jsonQuery = CONCAT('SELECT JSON_INSERT(@json, "$.defId_', v_dataDefId ,'",CAST(''', @columnMeta ,''' AS JSON)) INTO @json;');  
      
      PREPARE stmt FROM @jsonQuery; 
      EXECUTE stmt; 
      DEALLOCATE PREPARE stmt;  
        
    END LOOP getDataForSampleColumns;
    CLOSE cursor_samplesOnQueue;
    
IF pTableType = 'data' THEN 
  SELECT * FROM (
    SELECT 
      sr.completedResult,
      sr.currentContainerId,
      sr.runId,
      sr.currentParentId,
      sr.currentParentPosition,
      sr.id AS 'specimenRunsId',
      rs.receivedDate AS 'specimenReceiveDate',
      concat( p.lastName, ', ', p.firstName, ' ', p.middleName ) AS 'patientName',
      vv.displayValue AS 'orderPriority',
      rf.mrnFacility,
      rf.mrn,
      rs.specimenType AS 'specimenType',
      p.dob AS 'dob',
      CONCAT(pan.name, ' ', IFNULL(t.name,''), ' ', IFNULL(m.name,'')) AS 'testAndMethod',
      ui.name AS 'queuedBy',
      os.name AS 'customerName',
      GROUP_CONCAT(DISTINCT(IFNULL(cn.note, '')) SEPARATOR '<br><br>') AS 'commentHistory',
      @json AS 'meta'
    FROM queues q
      INNER JOIN protocolSteps ps
          ON q.step = ps.displayName
      LEFT JOIN poolRuns pr
      ON pr.currentContainerId = pParentId 
      INNER JOIN specimenRuns sr
        ON q.containerId = sr.runId
        OR (q.containerId = sr.currentParentId AND q.containerId = pParentId)
        OR ( sr.currentParentId = pParentId AND pr.currentContainerId IS NOT NULL )
      INNER JOIN events e 
        ON q.eventId = e.eventId
      INNER JOIN userInfo ui 
        ON e.userId = ui.userId 
      INNER JOIN contents c 
        ON sr.currentContainerId = c.containerId 
        AND c.contentType = 'requestId' 
      INNER JOIN requestForms rf 
        ON c.content = rf.requestId
      LEFT JOIN containerNotes cn
        ON cn.containerId = sr.runId
      LEFT JOIN validValues vv
        ON vv.value = rf.priority
        AND vv.setName = 'priority'
      INNER JOIN patients p 
        ON rf.patientId = p.patientId
      INNER JOIN organizationSites os 
        ON rf.physicianSiteId = os.siteId
      INNER JOIN specimenMethods sm 
        ON sr.specimenMethodsId = sm.id
      INNER JOIN panels pan
        ON sm.panelCode = pan.panelCode
      LEFT JOIN methods m 
        ON sm.methodCode = m.methodCode
      LEFT JOIN tests t 
        ON sm.testCode = t.testCode
      INNER JOIN contents c2
        ON sr.currentContainerId = c2.containerId
        AND c2.contentType = 'specimenId'
      INNER JOIN requestSpecimens rs 
        ON rf.requestId = rs.requestId 
        AND rs.specimenId = c2.content
    WHERE q.step = pStep
      AND ps.stepName <> 'Analysis: Pool Tube Data Review'
    GROUP BY sr.runId
    UNION 
    SELECT 
      pr.completedResult,
      pr.currentContainerId,
      pr.poolRunId,
      pr.currentParentId,
      pr.currentParentPosition,
      pr.id AS 'specimenRunsId',
      '' AS 'specimenReceiveDate',
      '' AS 'patientName',
      vv.displayValue AS 'orderPriority',
      '',
      '',
      '' AS 'specimenType',
      '' AS 'dob',
      '' AS 'testAndMethod',
      ui.name AS 'queuedBy',
      '',
      GROUP_CONCAT(DISTINCT(IFNULL(cn.note, '')) SEPARATOR '<br><br>') AS 'commentHistory',
      @json AS 'meta'
    FROM queues q
      INNER JOIN poolRuns pr
        ON q.containerId = pr.poolRunId
        OR (q.containerId = pr.currentParentId AND q.containerId = pParentId)
      INNER JOIN protocolSteps ps
        ON q.step = ps.displayName
      INNER JOIN events e 
        ON q.eventId = e.eventId
      INNER JOIN userInfo ui 
        ON e.userId = ui.userId  
      LEFT JOIN containerNotes cn
        ON cn.containerId = pr.poolRunId
      LEFT JOIN containerProperties cp1
        ON pr.currentContainerId = cp1.containerId
        AND property = 'Container Priority'
      LEFT JOIN validValues vv
        ON vv.value = cp1.value
        AND vv.setName = 'priority'
    WHERE q.step = pstep
      AND ps.stepName = 'Analysis: Pool Tube Data Review'
    GROUP BY pr.poolRunId
    ) a 
  WHERE a.completedResult <> 'rework' OR a.completedResult IS NULL;

ELSEIF pTableType = 'control' THEN 
 SELECT 
  cr.currentContainerId, 
  cr.controlRunId AS "runId", 
  c.controlType AS 'controlType',
  c.controlId AS 'controlId', 
  cr.currentParentId, 
  cr.currentParentPosition, 
  cr.id AS 'controlRunsId',
  GROUP_CONCAT(DISTINCT(IFNULL(cn.note, '')) SEPARATOR '<br><br>') AS 'commentHistory',
  @json AS 'meta' 
FROM queues q 
INNER JOIN controlRuns cr
  ON q.containerId = cr.currentParentId AND q.containerId = pParentId
INNER JOIN controls c 
  ON c.controlId = cr.controlId
INNER JOIN inventoryUsage iu
  ON iu.inventoryItem = c.controlType
LEFT JOIN containerNotes cn 
  ON cn.containerId = cr.controlRunId
WHERE q.step = pStep AND iu.inventoryItemUsage = pControlType
GROUP BY cr.controlRunId;
END IF;
  
END;;
DELIMITER ;