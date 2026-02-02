from java.sql import SQLException
from run import Run
from poolRun import PoolRun
from analysis_functions import getRunMetaData
from containers import ControlRun
import copy
import re
#TODO create class SaveAnalysisMethod
#TODO look into creating data definition class
#TODO add _ctrl_load_config attribute
#TODO update save_field_data_config() to save control type (null if blank)
class AnalysisMethod(object):
    """ Class for analysis method object

        This class is used for saving the method configuration as well as retreving the configuration based on
        the method version id. This should be a one stop shop for analysis methods.

        Attributes:   
            method_version_id
        
        TODO: 
            Make global constants for interp insert queries
            Possible break the analysis step functions into a class (AnalysisData)
    """
    def __init__(self, switchboard, method_version_id):
        self.switchboard = switchboard
        self._method_version_id = method_version_id
        self._method_id = None
        self._method_panels = []
        self._load_config = []
        self._meta_config = []
        self._control_config = []
        self._control_load_config = []
        self._method_config = []
        self._full_config = []
    
        self.set_method_attributes()

    def __repr__(self):
        return 'AnalysisMethod(version_id: {})'.format(self.method_version_id)

    @property
    def method_version_id(self):
        return self._method_version_id

    @property
    def load_config(self):
        return self._load_config

    @property
    def meta_config(self):
        return self._meta_config

    @property
    def control_config(self):
        return self._control_config

    @property
    def method_config(self):
        return self._method_config

    @property
    def full_config(self):
        return self._full_config

    @property
    def method_id(self):
        return self._method_id

    @property
    def method_panels(self):
        return self._method_panels

    @method_panels.setter
    def method_panels(self, panels):
        self._method_panels = panels

    def set_method_attributes(self):
        #TODO break into two function
        #   one that pulls the field and adds it to full config
        #   one that gets passed the field and definer type to add to correct list
        """Returns a list of the previously saved field data for this method
        
            is_reportable key in field object is a placeholder to be populated later 
        Returns:
            A list of field objects
        """
        self._method_id = self.set_method_id()
        self._method_panels = self.set_method_panels()

        blnk_list = []
        ctrl_list = []
        load_list = []
        meta_list = []
        fields = []

        config_query = '''
            SELECT 
                IFNULL(andd.id, '') AS "analysisDataDefinitionId",
                IFNULL(andd.definerType, '')  AS "definerType",
                -- IFNULL(andd.controlType, '') AS "controlType",
                IFNULL(andd.sequence, '')  AS "tableFieldOrder",
                IFNULL(andd.value, '')  AS "fieldName",
                IFNULL(andd.dataType, '')  AS "dataType",
                IFNULL(andd.sigFig, '')  AS "sigFigs",
                IFNULL(andd.report, '')  AS "reportOption",
                IFNULL(andd.resultCode, '')  AS "resultCode",
                IFNULL(andd.limitType, '')  AS "limitType",
                IFNULL(andd.units, '') AS "units",
                IFNULL(andd.loadDataAnalysisDataDefinitionId, '') AS "loadDefId",
                IFNULL(andd.formInputSettingsId, '') AS "fisId"
            FROM analysisDataDefinition andd
            WHERE andd.analysisMethodVersionsId = ? 
                AND andd.definerType IN ('data', 'detector', 'loadData', 'metaData', 'control') 
            GROUP BY andd.id, andd.VALUE
            ORDER BY andd.definerType DESC, andd.sequence
        '''

        try:
            config_stmt = self.switchboard.connection.prepareStatement(config_query)
            config_stmt.setString(1, self.method_version_id)
            self.switchboard.log(str(config_stmt))
            config_rs = config_stmt.executeQuery()
            while config_rs.next():

                definer_type = config_rs.getString('definerType')
                definition_id = config_rs.getString('analysisDataDefinitionId')
                limit_type = config_rs.getString('limitType') 
                load_id = config_rs.getString('loadDefId')
                fis_id = config_rs.getString('fisId')
                field_order = config_rs.getString('tableFieldOrder')
                limits = self.get_field_limits(definition_id, limit_type)


                field = {
                    'value': '',
                    'actual_interpretation': '',
                    'original_interpretation': '',
                    'load_limit_override': '',
                    'definition_id': definition_id,
                    'definer_type': definer_type,
                    'load_id': load_id,
                    'fis_id': fis_id,
                    'field_order': field_order, 
                    'field_name': config_rs.getString('fieldName'),
                    'data_type': config_rs.getString('dataType'),
                    'sig_figs': config_rs.getString('sigFigs'),
                    'units': config_rs.getString('units'), 
                    'report_option': config_rs.getString('reportOption'),
                    'result_code': config_rs.getString('resultCode'),
                    'limit_type': limit_type,
                    'limits': limits,
                    'interp_list': self.get_field_interp_list(limits, limit_type),
                    'modifiers': self.get_modifiers(definition_id, definer_type),
                    'panels':self.get_definition_panels(definition_id),
                    'is_reportable': '1'
                    #'control_type': config_rs.getString('controlType'),
                }

                if definer_type in ['data', 'detector']:
                    blnk_list.append(field)
                elif definer_type == 'control':
                    ctrl_list.append(field)
                elif definer_type == 'loadData':
                    load_field = self.get_load_data_config(field)
                    load_list.append(load_field)
                elif definer_type == 'metaData':
                    meta_info = self.get_meta_data_config(fis_id)
                    field['field_name'] = meta_info.get('screen_label', '')
                    field['input_name'] = meta_info.get('input_name', '')
                    meta_list.append(field)

            self._meta_config = meta_list
            self._load_config = load_list
            self._control_config = ctrl_list
            self._method_config = blnk_list
            self._full_config = meta_list + load_list + ctrl_list + blnk_list    

            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')
            return True

        except SQLException as e:
            self.switchboard.log("---*** SQLEXCEPTION AT SET_METHOD_ATTRIBUTES ***----")
            self.switchboard.log("ERROR MESSAGE: " + str(e.message))
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
            raise
            return
        except BaseException as e:
            self.switchboard.log("---*** BASE EXCEPTION AT SET_METHOD_ATTRIBUTES ***----")
            self.switchboard.log("ERROR MESSAGE: " + str(e.message))
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
            raise
            return
        finally:
            config_stmt.close()

    def set_method_id(self):
        query = '''
            SELECT analysisMethodsId FROM analysisMethodVersions WHERE id = ?
        '''
        stmt = self.switchboard.connection.prepareStatement(query)
        stmt.setString(1, self.method_version_id)
        rs = stmt.executeQuery()

        if rs.next():
            return rs.getString(1)
        else:
            return None

    def set_method_panels(self):
        method_panels = []
        query = '''
            SELECT amp.panelCode 
            FROM analysisMethodVersions amv 
            INNER JOIN analysisMethodPanels amp
                ON amv.analysisMethodsId = amp.analysisMethodId
            WHERE amv.id = ?
        '''
        stmt = self.switchboard.connection.prepareStatement(query)
        stmt.setString(1, self.method_version_id)
        rs = stmt.executeQuery()

        while rs.next():
            method_panels.append(rs.getString('panelCode'))

        return method_panels


    def get_definition_panels(self, def_id):
        """Returns list of associated panel codes for the specified definition(field)
        Args:
            def_id: analysis data definition id
        Returns:
            panels: list of panel codes
        """
        panels = []
        query = '''
            SELECT adp.panelCode, pan.name
            FROM analysisDefinitionPanels adp
            INNER JOIN panels pan
                ON pan.panelCode = adp.panelCode
            WHERE adp.definitionId = ?
        '''
        stmt = self.switchboard.connection.prepareStatement(query)
        stmt.setString(1, def_id)
        rs = stmt.executeQuery()

        while rs.next():
            panels.append(rs.getString('panelCode'))

        return panels


    def get_meta_data_config(self, fis_id):
        meta_query = '''
            SELECT 
                fis.screenLabel AS 'screenLabel',
                fcp.inputName AS 'inputName'
            FROM formInputSettings fis
            INNER JOIN formConfigurableParts fcp
                ON fcp.id = fis.formConfigurablePartsId
            WHERE fis.id = ?
        '''
        try:
            stmt = self.switchboard.connection.prepareStatement(meta_query)
            stmt.setString(1, fis_id)
            self.switchboard.log(str(stmt))
            rs = stmt.executeQuery()

            if rs.next():
                meta_info = {
                    'screen_label': rs.getString('screenLabel'),
                    'input_name': rs.getString('inputName')
                }
                self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')
                return meta_info
            else:
                self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')
                return {}
        except BaseException as e:
            self.switchboard.log("---*** PYTHON EXCEPTION AT GET_META_DATA_CONFIG ***---")
            self.switchboard.log("ERROR MESSAGE: " + str(e.message))
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
            raise
            return
        except SQLException as e:
            self.switchboard.log("---*** SQL EXCEPTION AT GET_META_DATA_CONFIG ***---")
            self.switchboard.log("ERROR MESSAGE: " + str(e.message))
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
            raise
            return
        finally:
            stmt.close()

    def get_load_data_config(self, field):
        """
            is_reportable key in field object is a placeholder to be populated later 

        Args:
        Returns: object 
        """
        query = '''
            SELECT
                def.id AS 'analysisDataDefinitionId',
                IFNULL(def.definerType, '') AS 'definerType',
                IFNULL(def.`sequence`, '') AS 'tableFieldOrder',
                IFNULL(def.`value`, '') AS 'fieldName',
                IFNULL(def.dataType, '') AS 'dataType',
                IFNULL(def.sigFig, '') AS 'sigFigs',
                IFNULL(def.report, '') AS 'reportOption',
                IFNULL(def.resultCode, '') AS 'resultCode',
                IFNULL(def.limitType, '') AS 'limitType',
                IFNULL(def.units, '') AS 'units'
            FROM analysisDataDefinition def
            WHERE def.id = ?
        '''
        try:
            stmt = self.switchboard.connection.prepareStatement(query)
            stmt.setString(1, field.get('load_id'))
            self.switchboard.log(str(stmt))
            rs = stmt.executeQuery()

            while rs.next():

                definer_type = rs.getString('definerType')
                definition_id = rs.getString('analysisDataDefinitionId')
                limit_type = rs.getString('limitType') 
                limits = self.get_field_limits(definition_id, limit_type)
                
                field['field_name'] = rs.getString('fieldName')
                field['data_type'] = rs.getString('dataType')
                field['load_definer_type'] = definer_type
                field['sig_figs'] = rs.getString('sigFigs')
                field['units'] = rs.getString('units')
                field['report_option'] = rs.getString('reportOption')
                field['result_code'] = rs.getString('resultCode')
                field['limit_type'] = limit_type
                field['limits'] = limits
                field['interp_list'] = self.get_field_interp_list(limits, limit_type)
                field['modifiers'] = self.get_modifiers(definition_id, definer_type)
                field['panels'] = self.get_definition_panels(definition_id)
                field['is_reportable'] = '1'
                
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')
            return field

        except BaseException as e:
            self.switchboard.log("---*** PYTHON EXCEPTION AT GET_LOAD_DATA_CONFIG ***---")
            self.switchboard.log("ERROR MESSAGE: " + str(e.message)) 
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
            raise
            return
        except SQLException as e:
            self.switchboard.log("---*** SQL EXCEPTION AT GET_LOAD_DATA_CONFIG ***---")
            self.switchboard.log("ERROR MESSAGE: " + str(e.message)) 
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
            raise
            return
        finally:
            stmt.close()
 
    def get_modifiers(self, detector_id, definer_type):
        '''Returns a list of field with a shared detector if

        Args:
            detector_id: data defintion id of parent(detector)
            definer_type: definer type of parent(detector)
        Returns:
            empty list if not a detector, list of fields otherwise
        '''
        modifiers = []
        if definer_type == 'detector':
            try:
                query = '''
                    SELECT 
                        def.id AS 'analysisDataDefinitionId',
                        IFNULL(def.definerType, '') AS 'definerType',
                        IFNULL(def.`sequence`, '') AS 'tableFieldOrder',
                        IFNULL(def.`value`, '') AS 'fieldName',
                        IFNULL(def.dataType, '') AS 'dataType',
                        IFNULL(def.sigFig, '') AS 'sigFigs',
                        IFNULL(def.report, '') AS 'reportOption',
                        IFNULL(def.resultCode, '') AS 'resultCode',
                        IFNULL(def.limitType, '') AS 'limitType',
                        IFNULL(def.units, '') AS 'units'
                    FROM analysisDataDefinition def
                    WHERE def.detectorDefinitionId = ?
                '''
                stmt = self.switchboard.connection.prepareStatement(query)
                stmt.setString(1, detector_id)
                self.switchboard.log(str(stmt))
                rs = stmt.executeQuery()

                while rs.next():

                    definer_type = rs.getString('definerType')
                    definition_id = rs.getString('analysisDataDefinitionId')
                    limit_type = rs.getString('limitType') 
                    
                    field = {
                        'definition_id': definition_id,
                        'definer_type': definer_type,
                        'field_order': rs.getString('tableFieldOrder'),
                        'field_name': rs.getString('fieldName'),
                        'data_type': rs.getString('dataType'),
                        'sig_figs': rs.getString('sigFigs'),
                        'units': rs.getString('units'), 
                        'report_option': rs.getString('reportOption'),
                        'result_code': rs.getString('resultCode'),
                        'limit_type': limit_type,
                        'actual_interpretation': '',
                        'original_interpretation': '',
                        'limits': self.get_field_limits(definition_id, limit_type),
                        'interp_list': [], #TODO
                    }

                    modifiers.append(field)

                self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')
                return modifiers

            except SQLException as e:
              self.switchboard.log("---*** SQLEXCEPTION AT GET_MODIFIERS ***----")
              self.switchboard.log("ERROR MESSAGE: " + str(e.message))
              self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
              raise
              return
            except BaseException as e:
              self.switchboard.log("---*** BASE EXCEPTION AT GET_MODIFIERS ***----")
              self.switchboard.log("ERROR MESSAGE: " + str(e.message))
              self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
              raise
              return
            finally:
                stmt.close()
        else:
            return []
  
    def get_field_interp_list(self, limits, limit_type):
        """Returns a list of the interpretations used for the select list on the front end
        """
        interp_list = []
        try:
            if limit_type == 'discrete':
                not_eq_interp = {
                        'display': limits[0].get('not_equal_interpretation', ''), 
                        'value':limits[0].get('not_equal_interpretation', ''),
                }
                interp_list.append(not_eq_interp)

                for lim in limits[1:]:
                    eq_interp = {
                        'display': lim.get('equal_interpretation', ''),
                        'value': lim.get('equal_interpretation', ''),
                    }
                    interp_list.append(eq_interp)
                return interp_list
        
            elif limit_type == 'threshold':

                b_interp = {
                    'display': limits.get('below_threshold_interpretation', ''),
                    'value': limits.get('below_threshold_interpretation', ''),
                }
                e_interp = {
                    'display': limits.get('equal_threshold_interpretation', ''),
                    'value': limits.get('equal_threshold_interpretation', ''),
                }
                a_interp = {
                    'display': limits.get('above_threshold_interpretation', ''),
                    'value': limits.get('above_threshold_interpretation', ''),
                }
                interp_list = [b_interp, e_interp, a_interp]
                return interp_list

            elif limit_type == 'range':

                bl_interp = {
                    'display': limits.get('below_lower_interpretation', ''),
                    'value': limits.get('below_lower_interpretation', ''),
                }
                el_interp = {
                    'display': limits.get('equal_lower_interpretation', ''),
                    'value': limits.get('equal_lower_interpretation', ''),
                }
                ir_interp = {
                    'display': limits.get('in_range_interpretation', ''),
                    'value': limits.get('in_range_interpretation', ''),
                }
                eu_interp = {
                    'display': limits.get('equal_upper_interpretation', ''),
                    'value': limits.get('equal_upper_interpretation', ''),
                }
                au_interp = {
                    'display': limits.get('above_upper_interpretation', ''),
                    'value': limits.get('above_upper_interpretation', ''),
                }
                interp_list = [bl_interp, el_interp, ir_interp, eu_interp, au_interp]
                return interp_list
            else:
                return []
        
        except BaseException as e:
            self.switchboard.log("---*** PYTHON EXCEPTION AT GET_FIELD_INTERP_LIST ***---")
            self.switchboard.log("ERROR MESSAGE: " + str(e.message))
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
            raise
            return

    def get_field_limits(self, analysis_data_definition_id, limit_type):
        """Gets the limits, interpretation, css class for the field

            Wording are hard coded to blank since they are not currentyl being used. They are not being removed
            as to not disrupt front end behaviour and to easily add back in if needed.

        Args:
            analysis_data_definition_id: defintion id of the field
            limit_type: pre-defined limit type (discrete/threshold/range)

        Returns:
            If discrete limit type:
                List of objects containing the interpreation, class, and discrete value
            If range or threshold:
                Object containing the interpreation, and class for each case (below/equal/above/etc.)
        """

        limits = []
        limits_query = '''
            SELECT
                IFNULL(limits.discrete, '') AS 'discrete',
                IFNULL(limits.lowerLimit, '') AS 'lowerLimit',
                IFNULL(limits.upperLimit, '') AS 'upperLimit',
                IFNULL(interpretations.equalDiscrete, '') AS 'equalDiscrete',
                IFNULL(interpretations.notEqualDiscrete, '') AS 'notEqualDiscrete',
                IFNULL(interpretations.belowLower, '') AS 'belowLower',
                IFNULL(interpretations.equalLower, '') AS 'equalLower',
                IFNULL(interpretations.betweenLowerUpper, '') AS 'betweenLowerUpper',
                IFNULL(interpretations.equalUpper, '') AS 'equalUpper',
                IFNULL(interpretations.aboveUpper, '') AS 'aboveUpper',
                IFNULL(css.equalDiscrete, '') AS 'equal_css',
                IFNULL(css.notEqualDiscrete, '') AS 'not_equal_css',
                IFNULL(css.belowLower, '') AS 'below_lower_css',
                IFNULL(css.equalLower, '') AS 'equal_lower_css',
                IFNULL(css.betweenLowerUpper, '') AS 'in_range_css',
                IFNULL(css.equalUpper, '') AS 'equal_upper_css',
                IFNULL(css.aboveUpper, '') AS 'above_upper_css'
            FROM analysisDataLimits limits
            INNER JOIN analysisDataInterpretation interpretations
                ON interpretations.analysisDataLimitsId = limits.id
            INNER JOIN analysisDataInterpretationCSSClass css
                ON css.analysisDataInterpretationId = interpretations.id
            WHERE limits.analysisDataDefinitionId = ?
        '''
        try:
            limits_stmt = self.switchboard.connection.prepareStatement(limits_query)
            limits_stmt.setString(1, analysis_data_definition_id)
            self.switchboard.log(str(limits_stmt))
            limits_rs = limits_stmt.executeQuery()
            
            if limit_type == 'discrete':
                while limits_rs.next():
                    eq_discrete = {
                        'discrete_limit': limits_rs.getString('discrete'),
                        'equal_interpretation': limits_rs.getString('equalDiscrete'),
                        'equal_wording': '',
                        'equal_css': limits_rs.getString('equal_css'),
                    } 
                    limits.append(eq_discrete)
                    not_eq_discrete = {
                        'not_equal_interpretation': limits_rs.getString('notEqualDiscrete'),
                        'not_equal_wording': '',
                        'not_equal_css': limits_rs.getString('not_equal_css'),
                    }

                try:
                    limits.insert(0, not_eq_discrete)
                except ValueError:
                    self.switchboard.log('---*** NO not_eq_discrete OBJECT FOUND ***---')
                
                self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')
                return limits
                            
            elif limit_type == 'range':
                if limits_rs.next():
                    range_object = {
                        'lower_limit': limits_rs.getString('lowerLimit'),
                        'upper_limit': limits_rs.getString('upperLimit'),
                        'below_lower_interpretation': limits_rs.getString('belowLower'),
                        'equal_lower_interpretation': limits_rs.getString('equalLower'),
                        'in_range_interpretation': limits_rs.getString('betweenLowerUpper'),
                        'equal_upper_interpretation': limits_rs.getString('equalUpper'),
                        'above_upper_interpretation': limits_rs.getString('aboveUpper'),
                        'below_lower_wording': '',
                        'equal_lower_wording': '',
                        'in_range_wording': '',
                        'equal_upper_wording': '',
                        'above_upper_wording': '',
                        'below_lower_css': limits_rs.getString('below_lower_css'),
                        'equal_lower_css': limits_rs.getString('equal_lower_css'),
                        'in_range_css': limits_rs.getString('in_range_css'),
                        'equal_upper_css': limits_rs.getString('equal_upper_css'),
                        'above_upper_css': limits_rs.getString('above_upper_css'),
                    }
                else:
                    range_object = {
                        'lower_limit': '',
                        'upper_limit': '',
                        'below_lower_interpretation': '',
                        'equal_lower_interpretation': '',
                        'in_range_interpretation': '',
                        'equal_upper_interpretation': '',
                        'above_upper_interpretation': '',
                        'below_lower_wording': '',
                        'equal_lower_wording': '',
                        'in_range_wording': '',
                        'equal_upper_wording': '',
                        'above_upper_wording': '',
                        'below_lower_css': '',
                        'equal_lower_css': '',
                        'in_range_css': '',
                        'equal_upper_css':  '',
                        'above_upper_css': '',
                    }

                self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')
                return range_object
                            
            elif limit_type == 'threshold':
                if limits_rs.next():
                    threshold_object = {
                        'threshold_limit': limits_rs.getString('upperLimit'),
                        'below_threshold_interpretation': limits_rs.getString('belowLower'),
                        'equal_threshold_interpretation': limits_rs.getString('equalLower'),
                        'above_threshold_interpretation': limits_rs.getString('aboveUpper'),
                        'below_threshold_wording': '',
                        'equal_threshold_wording': '',
                        'above_threshold_wording': '',
                        'below_threshold_css': limits_rs.getString('below_lower_css'),
                        'equal_threshold_css': limits_rs.getString('equal_lower_css'),
                        'above_threshold_css': limits_rs.getString('above_upper_css'),
                    }
                else:
                    threshold_object = {
                        'threshold_limit': '',
                        'below_threshold_interpretation': '',
                        'equal_threshold_interpretation': '',
                        'above_threshold_interpretation': '',
                        'below_threshold_wording': '',
                        'equal_threshold_wording': '',
                        'above_threshold_wording': '',
                        'below_threshold_css': '',
                        'equal_threshold_css': '',
                        'above_threshold_css': '',
                    }
                self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')
                return threshold_object

            else:
                self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')
                return []

        except SQLException as e:
            self.switchboard.log("---*** SQLEXCEPTION AT GET_FIELD_LIMITS THRESHOLD ***----")
            self.switchboard.log("ERROR MESSAGE: " + str(e.message))
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
        except BaseException as e:
            self.switchboard.log("---*** BASE EXCEPTION AT GET_FIELD_LIMITS THRESHOLD ***----")
            self.switchboard.log("ERROR MESSAGE: " + str(e.message))
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
            raise
            return
        finally:
            limits_stmt.close()

    def save_method_panels(self, panel_list, method_id):
        """Saves panels associated to the method

            Deletes previous associations and inserts new if they exist

        Args:
            panel_list: list of panel codes
            method_id: analysis method id
        """
        panel_list = self.clean_blank_list(panel_list)
        self.method_panels = panel_list
        panel_delete = '''
            DELETE FROM analysisMethodPanels WHERE analysisMethodId = ?
        '''
        try:
            stmt = self.switchboard.connection.prepareStatement(panel_delete)
            stmt.setString(1, method_id)
            stmt.executeUpdate()
        
            panel_insert = '''
                INSERT INTO analysisMethodPanels(analysisMethodId,eventId,panelCode)
                VALUES (?,?,?)
            '''
            stmt = self.switchboard.connection.prepareStatement(panel_insert)
            stmt.setString(1, method_id)
            stmt.setLong(2, self.switchboard.eventId)

            for panel in panel_list:
                if null_if_blank(panel):
                    stmt.setString(3,panel)
                    stmt.executeUpdate()

            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')
      
        except SQLException as e:
            self.switchboard.log("---*** SQLEXCEPTION AT SAVE_PANEL_ASSOCIATIONS ***----")
            self.switchboard.log("ERROR MESSAGE: " + str(e.message))
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
        except BaseException as e:
            self.switchboard.log("---*** BASE EXCEPTION AT SAVE_PANEL_ASSOCIATIONS ***----")
            self.switchboard.log("ERROR MESSAGE: " + str(e.message))
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
            raise
            return
        finally:
            stmt.close()

    def save_meta_data_config(self, method_meta_data):
        """Saves the meta data configuration in analysisDataDefinition table

        Args:
            method_meta_data: List of objects each containing the field order and formInputSettings id to 
            link the meta data to the proper value.
        """
        meta_insert = '''
            INSERT INTO analysisDataDefinition (
                analysisMethodVersionsId, definerType, sequence, 
                dataType, eventId, formInputSettingsId
            ) VALUES (?, ?, ?, ?, ?, ?)
        '''

        try:
            meta_stmt = self.switchboard.connection.prepareStatement(meta_insert)
            for field in method_meta_data:
                meta_stmt.setString(1, self.method_version_id)
                meta_stmt.setString(2, 'metaData')
                meta_stmt.setString(3, null_if_blank(field['order']))
                meta_stmt.setString(4, 'varchar')
                meta_stmt.setLong(5, self.switchboard.eventId)
                meta_stmt.setString(6, null_if_blank(field['id']))
                meta_stmt.executeUpdate()
          
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')
      
        except SQLException as e:
            self.switchboard.log("---*** SQLEXCEPTION AT SAVE_META_DATA_CONFIG ***----")
            self.switchboard.log("ERROR MESSAGE: " + str(e.message))
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
        except BaseException as e:
            self.switchboard.log("---*** BASE EXCEPTION AT SAVE_META_DATA_CONFIG ***----")
            self.switchboard.log("ERROR MESSAGE: " + str(e.message))
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
            raise
            return

        
    def save_load_data_config(self, method_load_data):
        """Saves the load data configuration in analysisDataDefinition table

        Args:
            method_load_data: List of objects each containing the field order, field type, and id to 
                link to the previously configured data field. 
        """
        conn = self.switchboard.connection
        load_insert = '''
            INSERT INTO analysisDataDefinition (
                analysisMethodVersionsId, definerType, sequence, 
                dataType, eventId, loadDataAnalysisDataDefinitionId
            ) VALUES (?, ?, ?, ?, ?, ?)
        '''
        try:
            stmt = conn.prepareStatement(load_insert)
            for field in method_load_data:
                stmt.setString(1, self.method_version_id)
                stmt.setString(2, 'loadData')
                stmt.setString(3, null_if_blank(field['order']))
                stmt.setString(4, null_if_blank(field['type']))
                stmt.setLong(5, self.switchboard.eventId)
                stmt.setString(6, null_if_blank(field['id']))
                stmt.executeUpdate()

          
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')
      
        except SQLException as e:
            self.switchboard.log("---*** SQLEXCEPTION AT SAVE_LOAD_DATA_CONFIG ***----")
            self.switchboard.log("ERROR MESSAGE: " + str(e.message))
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
        except BaseException as e:
            self.switchboard.log("---*** BASE EXCEPTION AT SAVE_LOAD_DATA_CONFIG ***----")
            self.switchboard.log("ERROR MESSAGE: " + str(e.message))
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
            raise
            return
        finally:
            stmt.close()

    def save_field_data_config(self, method_field_data, detector_id=None):
        """Saves the data for configured fields

            Saves data in analysisDataDefinition, analysisDataLimits, reportResultWording, 
            and analysisDataInterpretationCSSClass tables.

            If the field is a modifier the detctor id is passed and saved, saved as null otherwise.
        """
        conn = self.switchboard.connection
        Statement = self.switchboard.statement
        field_data_insert = '''
            INSERT INTO analysisDataDefinition(
                analysisMethodVersionsId, definerType, sequence, 
                value, dataType, limitType, units, sigFig, report, 
                resultCode, eventId, detectorDefinitionId
            ) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)
        '''
        try:
            field_data_insert_stmt = conn.prepareStatement(field_data_insert, Statement.RETURN_GENERATED_KEYS)

            for field in method_field_data:
                

                limits = field['limits']
                units = field['units']
                limit_type = null_if_blank(field['limitType'])
                definer_type = null_if_blank(field['definerType'])
                modifiers = null_if_blank(field['modifierList'])
                control_type = null_if_blank(field.get('control_type'))
                def_panels = field.get('panels')

                field_data_insert_stmt.setString(1, self.method_version_id)
                field_data_insert_stmt.setString(2, definer_type) 
                field_data_insert_stmt.setString(3, null_if_blank(field['tableFieldOrder']))
                field_data_insert_stmt.setString(4, null_if_blank(field['fieldName']))
                field_data_insert_stmt.setString(5, null_if_blank(field['dataType']))
                field_data_insert_stmt.setString(6, limit_type)
                field_data_insert_stmt.setString(7, null_if_blank(field['units']))
                field_data_insert_stmt.setString(8, null_if_blank(field['sigFigs']))
                field_data_insert_stmt.setString(9, null_if_blank(field['reportOption']))
                field_data_insert_stmt.setString(10, null_if_blank(field['resultCode']))
                field_data_insert_stmt.setLong(11, self.switchboard.eventId)
                field_data_insert_stmt.setString(12, detector_id)
                field_data_insert_stmt.executeUpdate()
                
                definition_id = self.get_last_id(field_data_insert_stmt) 

                if limit_type:
                    self.save_limits(limit_type, limits, definition_id)
                if  modifiers and definer_type == 'detector': 
                    self.save_field_data_config(modifiers, definition_id)

                self.save_definition_panels(def_panels, definition_id)
                
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')
     
        except SQLException as e:
            self.switchboard.log("---*** SQLEXCEPTION AT SAVE_FIELD_DATA_CONFIG ***----")
            self.switchboard.log("ERROR MESSAGE: " + str(e.message))
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
            raise
            return
        except BaseException as e:
            self.switchboard.log("---*** BASE EXCEPTION AT SAVE_FIELD_DATA_CONFIG ***----")
            self.switchboard.log("ERROR MESSAGE: " + str(e.message))
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
            raise
            return

    def save_definition_panels(self, panels, def_id):
        """Saves the panels associated with the definition
            
            If the user does not select panels then all panels associated with the method are associated with
            the definition

        Args:
            panels: list of panel codes
            def_id: analysis data definition id
        """
        insert = '''
            INSERT INTO analysisDefinitionPanels(definitionId, eventId, panelCode)  VALUES(?,?,?)
        '''
        stmt = self.switchboard.connection.prepareStatement(insert)
        stmt.setString(1, def_id)
        stmt.setLong(2,self.switchboard.eventId )
        panels = self.clean_blank_list(panels)
        if panels:
            for panel in panels:
                if null_if_blank(panel):
                    stmt.setString(3, panel)
                    stmt.executeUpdate()
        elif self.method_panels:
            for panel in self.method_panels:
                if null_if_blank(panel):
                    stmt.setString(3, panel)
                    stmt.executeUpdate()
                else:
                    self.switchboard.log('NO PANELS ASSOCIATED TO METHOD {}'.format(self.method_id))

        else:
            self.switchboard.log('NO PANELS ASSOCIATED TO METHOD {}'.format(self.method_id))
        stmt.close()

        return True

    def clean_blank_list(self, panel_list):
        """If list only contains blank string return empty list
        Args:
            panel_list: list of panel codes
        Returns:
            list of associated panels
        """
        if len(panel_list) == 1 and panel_list[0] == '':
            return []
        else:
            return panel_list

    def save_limits(self, limit_type, limits, definition_id):
        """Saves the limits to analysisDataLimits and calls subsequent function for css class

        Args:
            limit_type: discrete/range/threshold
            limits: list if discrete, dict if range/threshold
            defintion_id: field analysisDataDefinitionId
        Returns:
            None if limit type is not discrete/threshold/range
        """
        conn = self.switchboard.connection
        Statement = self.switchboard.statement
        field_limit_insert = '''
            INSERT INTO analysisDataLimits(
                analysisDataDefinitionId, eventId, 
                lowerLimit, upperLimit, discrete
            ) VALUES(?,?,?,?,?)
        '''
        try:
            field_limit_insert_stmt = conn.prepareStatement(field_limit_insert, Statement.RETURN_GENERATED_KEYS)
            field_limit_insert_stmt.setString(1, null_if_blank(definition_id))
            field_limit_insert_stmt.setLong(2, self.switchboard.eventId)
            
            if limit_type == 'discrete':
                not_equal = limits[0]
                field_limit_insert_stmt.setString(3, None)
                field_limit_insert_stmt.setString(4, None)
                for discrete in limits[1:]:
                    discrete_limit = null_if_blank(discrete['discreteLimit'])
                    if discrete_limit:
                        field_limit_insert_stmt.setString(5,discrete_limit) 
                        field_limit_insert_stmt.executeUpdate()
                        limit_id = self.get_last_id(field_limit_insert_stmt)
                        self.save_discrete_interpretation(not_equal,discrete,limit_id)
            elif limit_type == 'range':
                field_limit_insert_stmt.setString(3, null_if_blank(limits['lowerLimit']))
                field_limit_insert_stmt.setString(4, null_if_blank(limits['upperLimit']))
                field_limit_insert_stmt.setString(5, None)
                field_limit_insert_stmt.executeUpdate()
                limit_id = self.get_last_id(field_limit_insert_stmt)
                self.save_interpretation(limits, limit_type, limit_id)
            elif limit_type == 'threshold':
                field_limit_insert_stmt.setString(3, null_if_blank(limits['thresholdLimit']))
                field_limit_insert_stmt.setString(4, null_if_blank(limits['thresholdLimit']))
                field_limit_insert_stmt.setString(5, None)
                field_limit_insert_stmt.executeUpdate()
                limit_id = self.get_last_id(field_limit_insert_stmt)
                self.save_interpretation(limits, limit_type, limit_id)
            else:
                self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')
                return None

            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')

        except SQLException as e:
            self.switchboard.log("---*** SQLEXCEPTION AT SAVE_LIMITS ***----")
            self.switchboard.log("ERROR MESSAGE: " + str(e.message))
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
        except BaseException as e:
            self.switchboard.log("---*** BASE EXCEPTION AT SAVE_FIELD_DATA_CONFIG ***----")
            self.switchboard.log("ERROR MESSAGE: " + str(e.message))
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
            raise
            return
        finally:
            field_limit_insert_stmt.close()


    def save_discrete_interpretation(self, not_equal, equal, limit_id):
        """Saves interpertation/css for discrete object
        Args:
            not_equal: dict containing not equal interp/css
            equal: dict containt equal interp/css
            limit_id: analysisDataLimitsId
        """
        conn = self.switchboard.connection
        Statement = self.switchboard.statement
        interpretation_insert = '''
            INSERT INTO analysisDataInterpretation(
                analysisDataLimitsId, eventId,
                equalDiscrete, notEqualDiscrete
            ) VALUES(?,?,?,?)
        '''
        try:
            stmt = conn.prepareStatement(interpretation_insert, Statement.RETURN_GENERATED_KEYS)
            stmt.setString(1, limit_id)
            stmt.setLong(2, self.switchboard.eventId)
            stmt.setString(3, null_if_blank(equal.get('equalInterpretation')))
            stmt.setString(4, null_if_blank(not_equal.get('notEqualInterpretation')))
            self.switchboard.log(str(stmt))
            stmt.executeUpdate()
            interp_id = self.get_last_id(stmt)
            
            self.save_discrete_css(interp_id, equal.get('equalCss', ''), not_equal.get('notEqualCss', ''))
                        
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')
            return True

        except SQLException as e:
            self.switchboard.log("---*** SQLEXCEPTION AT SAVE_DISCRETE ***----")
            self.switchboard.log("ERROR MESSAGE: " + str(e.message))
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
        except BaseException as e:
            self.switchboard.log("---*** BASE EXCEPTION AT SAVE_DISCRETE ***----")
            self.switchboard.log("ERROR MESSAGE: " + str(e.message))
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
            raise
            return
        finally:
            stmt.close()
            
    def save_discrete_css(self, interp_id, e_css, ne_css):
        """Saves css for discrete ranges
        Args:
            interp_id: analysisDataInterpretationId
            e_css: css class for equal discrete
            ne_css: css class for not equal discrete
        """ 
        css_class_insert = '''
            INSERT INTO analysisDataInterpretationCSSClass(
                analysisDataInterpretationId, eventId,
                equalDiscrete, notEqualDiscrete
            ) VALUES(?,?,?,?)
        '''

        try:
            c_stmt = self.switchboard.connection.prepareStatement(css_class_insert)
            c_stmt.setString(1, interp_id)
            c_stmt.setLong(2, self.switchboard.eventId)
            c_stmt.setString(3, null_if_blank(e_css))
            c_stmt.setString(4, null_if_blank(ne_css))
            self.switchboard.log(str(c_stmt))
            c_stmt.executeUpdate()
            return True

        except SQLException as e:
            self.switchboard.log("---*** SQLEXCEPTION AT SAVE_DISCRETE_CSS ***----")
            self.switchboard.log("ERROR MESSAGE: " + str(e.message))
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')

    def save_interpretation(self, interpretations, limit_type, limit_id):
        """Saves interpretation/css class for range/threshold fields

        Args:
            interpretations: dict with needed data
            limit_type: range/threshold
            limit_id: analysisDataLimitsId
        """
        if limit_type == 'range':
            bl_intp = interpretations.get('belowLowerInterpretation')
            el_intp = interpretations.get('equalLowerInterpretation')
            ir_intp = interpretations.get('inRangeInterpretation')
            eu_intp = interpretations.get('equalUpperInterpretation')
            au_intp = interpretations.get('aboveUpperInterpretation')
            
            bl_css = interpretations.get('belowLowerCss')
            el_css = interpretations.get('equalLowerCss')
            ir_css = interpretations.get('inRangeCss')
            eu_css = interpretations.get('equalUpperCss')
            au_css = interpretations.get('aboveUpperCss')
            
        elif limit_type == 'threshold':
            bl_intp = interpretations.get('belowThresholdInterpretation')
            el_intp = interpretations.get('equalThresholdInterpretation')
            ir_intp = el_intp
            eu_intp = el_intp
            au_intp = interpretations.get('aboveThresholdInterpretation')
            
            bl_css = interpretations.get('belowThresholdCss')
            el_css = interpretations.get('equalThresholdCss')
            ir_css = el_css
            eu_css = el_css
            au_css = interpretations.get('aboveThresholdCss')
        
        else:
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')
            return None
        
        interp_id = self.save_interp(limit_id, bl_intp, el_intp, ir_intp, eu_intp, au_intp)
        self.save_css(interp_id, bl_css, el_css, ir_css, eu_css, au_css)
                    
        return True

    def save_interp(self, limit_id, bl_intp, el_intp, ir_intp, eu_intp, au_intp):
        """Inserts into analysisDataInterpretations
        Args:
            limit_id: analysisDataLimitsId 
            bl_intp: below lower
            el_intp: equal lower
            ir_intp: in range
            eu_intp: equal upper
            au_intp: abouve upper
        Returns:
            interp_id: last insert id
        """
        conn = self.switchboard.connection
        Statement = self.switchboard.statement
        interpreation_insert = '''
            INSERT INTO analysisDataInterpretation(
                analysisDataLimitsId, eventId, belowLower,
                equalLower, betweenLowerUpper, equalUpper,
                aboveUpper
            ) VALUES(?,?,?,?,?,?,?)
        '''
        try:
            i_stmt = conn.prepareStatement(interpreation_insert, Statement.RETURN_GENERATED_KEYS)
            i_stmt.setString(1, limit_id)
            i_stmt.setLong(2, self.switchboard.eventId)
            i_stmt.setString(3, null_if_blank(bl_intp))
            i_stmt.setString(4, null_if_blank(el_intp))
            i_stmt.setString(5, null_if_blank(ir_intp))
            i_stmt.setString(6, null_if_blank(eu_intp))
            i_stmt.setString(7, null_if_blank(au_intp))
            self.switchboard.log(str(i_stmt))
            i_stmt.executeUpdate()
            interp_id = self.get_last_id(i_stmt)

            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')
            return interp_id

        except SQLException as e:
            self.switchboard.log("---*** SQLEXCEPTION AT SAVE_INTERP ***----")
            self.switchboard.log("ERROR MESSAGE: " + str(e.message))
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')



    def save_css(self, interp_id, bl_css, el_css, ir_css, eu_css, au_css):
        """Inserts into analysisDataInterpretationCSSClass
        Args:
            interp_id: analysisDataInterpretationId 
            bl_css: below lower
            el_css: equal lower
            ir_css: in range
            eu_css: equal upper
            au_css: abouve upper

        """
        css_class_insert = '''
            INSERT INTO analysisDataInterpretationCSSClass(
                analysisDataInterpretationId, eventId, belowLower,
                equalLower, betweenLowerUpper, equalUpper, aboveUpper
            ) VALUES(?,?,?,?,?,?,?)
        '''
        try:
            stmt = self.switchboard.connection.prepareStatement(css_class_insert)
            stmt.setString(1, interp_id)
            stmt.setLong(2, self.switchboard.eventId)
            stmt.setString(3, null_if_blank(bl_css))
            stmt.setString(4, null_if_blank(el_css))
            stmt.setString(5, null_if_blank(ir_css))
            stmt.setString(6, null_if_blank(eu_css))
            stmt.setString(7, null_if_blank(au_css))
            self.switchboard.log(str(stmt))
            stmt.executeUpdate()

            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')
            return True

        except SQLException as e:
            self.switchboard.log("---*** SQLEXCEPTION AT SAVE_CSS ***----")
            self.switchboard.log("ERROR MESSAGE: " + str(e.message))
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
        finally:
            stmt.close()


    def save_to_inst_config(self, method_to_inst_data):
        """Saves the specimen and location column in analysisDataDefinition table for download steps
        Args:
            method_to_inst_data: dict with specimen and location column info
        """
        conn = self.switchboard.connection
        to_inst_insert = '''
            INSERT INTO analysisDataDefinition(
                analysisMethodVersionsId, definerType,
                sequence, value, dataType, eventId
            )VALUES(?,?,?,?,?,?)
        '''
        try:
            for obj in method_to_inst_data:
                to_inst_stmt = conn.prepareStatement(to_inst_insert)
                to_inst_stmt.setString(1, self.method_version_id)
                to_inst_stmt.setString(2, 'specimenColumn')
                to_inst_stmt.setString(3, obj['specimenColumn'])
                to_inst_stmt.setString(4, obj['specimenColumn'])
                to_inst_stmt.setString(5, 'decimal')
                to_inst_stmt.setLong(6, self.switchboard.eventId)
                
                to_inst_stmt.executeUpdate()

                to_inst_stmt.setString(2, 'locationColumn')
                to_inst_stmt.setString(3, obj['locationColumn'])
                to_inst_stmt.setString(4, obj['locationColumn'])
                
                to_inst_stmt.executeUpdate()


            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')

        except SQLException as e:
            self.switchboard.log("---*** SQLEXCEPTION AT SAVE_INTERPRETATION ***----")
            self.switchboard.log("ERROR MESSAGE: " + str(e.message))
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
        except BaseException as e:
            self.switchboard.log("---*** BASE EXCEPTION AT SAVE_INTERPRETATION ***----")
            self.switchboard.log("ERROR MESSAGE: " + str(e.message))
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
            raise
            return
        finally:
            to_inst_stmt.close()
    
    def get_last_id(self, stmt):
        """Returns the last inserted id from the stmt
        
        Args:
            stmt: sql statement
        Returns:
            last inserted id as string or null
        """
        id_rs = stmt.getGeneratedKeys()
        if id_rs.next():
            return id_rs.getString(1)
        else:
            return None  

class AnalysisData(AnalysisMethod):
    """Class for making analysis tables and applying previously entered data/meta data

    Attributes:
        method_version_id: analysis method version
        protocol_step: protocol step name
    """
    from dateFormatter import DateFormatter
    def __init__(self, switchboard, method_version_id, protocol_step):
        self._protocol_step = protocol_step

        AnalysisMethod.__init__(self, switchboard, method_version_id)

    def __repr__(self):
        return 'AnalysisData(MethodVersion: {}, ProtocolStep: {})'.format(self.method_version_id, self.protocol_step)

    @property
    def protocol_step(self):
        return self._protocol_step

    def make_table_objects(self, runs):
        """Returns a list of rows used to create/populate the specimen table
        Args:
            runs: list of run ids
        Returns:
            rows: list of rows with appropriate data
        """
        rows = []
        try:
            for run in runs:
                spec_info = self.get_specimen_info(run)
                meta_data_fields = self.apply_meta_data(run)
                blnk_data_fields = self.method_config
                
                load_data_fields = self.apply_load_data(run)
                if load_data_fields:
                    load_data_rows = self.make_load_data_rows(load_data_fields)
                    for l_row in load_data_rows:
                        row = spec_info + meta_data_fields + l_row + blnk_data_fields
                        rows.append(row)
                else:
                    row = spec_info + meta_data_fields + blnk_data_fields
                    rows.append(row)
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')
            return rows

        except TypeError as e:
            self.switchboard.log("---*** TYPE ERROR AT MAKE_TABLE_OBJECTS ***----")
            self.switchboard.log("ERROR MESSAGE: " + str(e.message))
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
            raise
            return

    def get_specimen_info(self, runId):
        """Returns object with specimen info needed for analysis
        Args:
            runId: run id string
        Returns:
            spec_info: list containing the specimen info object (obj in list to add to other lists)
        """
        if self.protocol_step == 'Analysis: Pool Tube Data Review':
            run = PoolRun(self.switchboard, runId)
        else:
            run = Run(self.switchboard, runId)
        sample_details = run.sampleDetails
        
        spec_info = {
            'run_id': runId,
            'current_container_id': run.current_container,
            'current_parent_id': run.current_parent,
            'current_parent_pos': run.current_position,
            'comment_history': run.commentHistory,
            'received_date': sample_details.get('specimenReceivedDate', ''),
            'patient_name': sample_details.get('patientName', ''),
            'order_priority': sample_details.get('orderPriority', ''),
            'mrn_facility': sample_details.get('mrnFacility', ''),
            'mrn': sample_details.get('mrn', ''),
            'family_id': sample_details.get('familyId', ''),
            'genetic_gender': sample_details.get('geneticGender', ''),
            'specimen_type': sample_details.get('specimenType', ''),
            'dob': sample_details.get('dob', ''),
            'test_and_method': sample_details.get('testAndMethod', ''),
            'queued_by': sample_details.get('queuedBy', ''),
            'customer_name': sample_details.get('customerName', ''),
            'assoc_panel': run.panel,
        }

        return [spec_info]

    def apply_meta_data(self, runId):
        """Returns list of meta data fields with values
        Args:
            runId: run id string
        Returns:
            results: list of meta data fields with data applied pretaining to the passed run
        """
        results = []

        for field in self.meta_config:
            meta_field = copy.deepcopy(field)
            input_name = field.get('input_name')
            result = getRunMetaData(self.switchboard, input_name, runId)
            result = self.format_if_date(result)
            meta_field['value'] = result
            results.append(meta_field)

        return results

    def format_if_date(self, result):
        """Determines if result is a date and formats accordingly
        Args:
            result: result string
        Returns:
            formatted date result if result in date format or passed result
        """
        pattern = '(\d{4})[/-](\d{2})[/-](\d{2})'
        if result and re.match(pattern, result):
            try:
                date_result = self.DateFormatter(self.switchboard, result)
                date_result = date_result.shortFormatDate()
                return date_result
            except ValueError as e:
                self.switchboard.log(str(e.message))
                return result
        else:
            return result
            
    def apply_modifier_load_data(self, modifiers, runId):
        """Applies previous data to modifier fields

        Args:
            modifiers: list of modifier fields
            runId: run id string 
        Returns:
            results: list of modifier fields with data applied
        """
        results = []
        try:
            stmt = self.switchboard.connection.prepareStatement(self.load_data_query)
            stmt.setString(1, runId)

            for mod in modifiers:
                stmt.setString(2, mod['definition_id'])
                self.switchboard.log(str(stmt))
                rs = stmt.executeQuery()
                mod_field = copy.deepcopy(mod)
                if rs.next():

                    mod_field['result'] = rs.getString('result')
                    mod_field['units'] = rs.getString('units')
                    mod_field['load_limit_override'] = rs.getString('referenceRange')
                    mod_field['actual_interpretation'] = rs.getString('actualInterp')
                    mod_field['original_interpretation'] = rs.getString('calculatedInterp')

                    results.append(mod_field)
                else:
                    mod_field['result'] = ''
                    mod_field['units'] = ''
                    mod_field['load_limit_override'] = ''
                    mod_field['actual_interpretation'] = ''
                    mod_field['original_interpretation'] = ''

                    results.append(mod_field)
            return results     

        except BaseException as e:
            self.switchboard.log("---*** PYTHON EXCEPTION AT APPLY_MODIFIER_LOAD_DATA ***---")
            self.switchboard.log("ERROR MESSAGE: " + str(e.message))
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
            raise
            return
        except SQLException as e:
            self.switchboard.log("---*** SQL Exception AT APPLY_MODIFIER_LOAD_DATA ***----")
            self.switchboard.log("ERROR MESSAGE: " + str(e.message))
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
            raise
            return
        finally:
            stmt.close()


    def apply_load_data(self, run):
        """Applies previously entered data for the run to each load data field
            
            This is used to handle the case of multiple results per run by adding all the results for the field
            to a list and adding that list to the complete list of results

        Args:
            run: run if string
        Returns:
            results: list of load data fields with previous data
        """
        results = []
        try:
            stmt = self.switchboard.connection.prepareStatement(self.load_data_query)
            stmt.setString(1, run)
            for field in self.load_config:
                field_list = []
                stmt.setString(2, field.get('load_id'))
                self.switchboard.log(str(stmt))
                rs = stmt.executeQuery()
                # FOR FUTURE DEV OF MODIFIERS 
                #if run_field.get('load_definer_type') == 'detector':
                #    run_field['modifiers'] = self.apply_modifier_load_data(run_field.get('modifiers'), run)
                
                if rs.next():
                    rs.beforeFirst()

                    while rs.next():
                        run_field = copy.deepcopy(field)
                        result = rs.getString('result')
                        run_field['interp_list'] = self.add_if_missing(run_field.get('interp_list'), rs.getString('actualInterp'))
                        run_field['value'] = self.format_if_date(result) #rs.getString('result')
                        run_field['units'] = rs.getString('units')
                        run_field['actual_interpretation'] = rs.getString('actualInterp')
                        run_field['original_interpretation'] = rs.getString('calculatedInterp')
                        run_field['load_limit_override'] = rs.getString('referenceRange')
                        run_field['data_id'] = rs.getString('analysisDataId')
                        run_field['interpretation_change'] = ''
                        run_field['is_reportable'] = rs.getString('isReportable')
                        field_list.append(run_field)
                else:
                    run_field = copy.deepcopy(field)
                    run_field['value'] = '' 
                    run_field['units'] = ''
                    run_field['load_limit_override'] = ''
                    run_field['actual_interpretation'] = ''
                    run_field['original_interpretation'] = ''
                    run_field['interpretation_change'] = ''
                    
                    field_list.append(run_field)

                results.append(field_list)
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')
            return results

        except BaseException as e:
            self.switchboard.log("---*** PYTHON EXCEPTION AT APPLY_LOAD_DATA ***---")
            self.switchboard.log("ERROR MESSAGE: " + str(e.message))
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
            raise
            return
        except SQLException as e:
            self.switchboard.log("---*** SQL Exception AT APPLY_LOAD_DATA ***----")
            self.switchboard.log("ERROR MESSAGE: " + str(e.message))
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
            raise
            return
        finally:
            stmt.close()

    def add_if_missing(self, lst, val):
        """Adds missing interpretation value (select list value) to list if it does not exist
            
            if the val is a value in the list of objects then l will exist if not l is [] and val is added

        Args:
            lst: list
            val: interpretation string
        Returns:
            lst
        """
        l = [v for v in lst if v.get('value') == val]

        if l:
            return lst
        else:
            obj = {'display': val, 'value': val}
            lst.append(obj)
            return lst

    @property
    def load_data_query(self):
        """Creates load data query based on protocol step

            Applies the correct table/attributes to the query
        """
        query = '''
            SELECT
                adr.id AS "analysisRunId",
                ad.id AS "analysisDataId",
                CASE addef.dataType
                    WHEN 'decimal' THEN
                        CASE addef.sigFig
                            WHEN 0 THEN ROUND(ad.decimalResult, 0)
                            WHEN 1 THEN ROUND(ad.decimalResult, 1)
                            WHEN 2 THEN ROUND(ad.decimalResult, 2)
                            WHEN 3 THEN ROUND(ad.decimalResult, 3)
                            WHEN 4 THEN ROUND(ad.decimalResult, 4)
                            WHEN 5 THEN ROUND(ad.decimalResult, 5)
                            WHEN 6 THEN ROUND(ad.decimalResult, 6)
                        END
                    WHEN 'varchar' THEN ad.varcharResult
                    WHEN 'dateTime' THEN ad.dateTimeResult
                    WHEN 'image' THEN ad.imageResult
                END AS "result",
                IFNULL(ad.referenceRange, '') AS "referenceRange",
                IFNULL(ad.units, IFNULL(addef.units, '')) AS "units",
                IFNULL(ad.calculatedInterpretation, '') AS "calculatedInterp",
                IFNULL(ad.actualInterpretation, '') AS "actualInterp",
                ad.isReportable AS "isReportable"
            FROM {} ad
            INNER JOIN {} adr
                ON ad.{} = adr.id
            INNER JOIN {} sr
                ON adr.{} = sr.id
            INNER JOIN analysisDataDefinition addef
                ON ad.analysisDataDefinitionId = addef.id
            WHERE sr.{} = ?
                AND ad.analysisDataDefinitionId = ?
        ''' 

        if self.protocol_step == 'Analysis: Pool Tube Data Review':
            data_table = 'analysisPoolTubeData'
            data_runs_table = 'analysisPoolTubeDataRuns'
            data_runs_id = 'analysisPoolTubeDataRunsId'
            runs_table = 'poolRuns'
            run_data_id = 'poolTubeRunsId'
            runs_id = 'poolRunId'
        else:
            data_table = 'analysisData'
            data_runs_table = 'analysisDataRuns'
            data_runs_id = 'analysisDataRunsId'
            runs_table = 'specimenRuns'
            run_data_id = 'specimenRunsId'
            runs_id = 'runId'

        return query.format(data_table, data_runs_table, data_runs_id, runs_table, run_data_id, runs_id)
    
    def make_load_data_rows(self, data):
        """Combines the load data fields
            
            The data is a list of lists so we first find the max length of the sub lists which will be used to 
            make the correct number of rows. If a certain field has fewer results than the max, the fields first
            result is appended to the row.
        Args:
            data: list of lists of load data fields
        Returns:
            rows: list of rows
        """
        rows = []
        if data:
            max_len = max([len(res) for res in data])

            for i in range(0,max_len):
                row = []
                for field in data:
                    try:
                        row.append(field[i])
                    except IndexError:
                        row.append(field[0])
                rows.append(row)
        return rows

    def make_control_table(self, ctl_runs):
        """Returns a list of rows used to create/populate the controls table
        Args:
            ctl_runs: list of control run ids
        Returns:
            rows: list of rows 
        """
        rows = []
        blnk_data_fields = self.method_config
        for ctl in ctl_runs:
            ctl_info = self.get_control_info(ctl)
            ctl_load = self.apply_control_load_data(ctl)
            row = ctl_info + ctl_load + blnk_data_fields
            rows.append(row)
        return rows

    def get_control_info(self, ctl_run):
        """Returns an object with the control info used for analysis
        Args:
            ctl_run: control run id string
        Returns:
            ctl_info: control info object in list to be added to other lists of fields
        """
        ctl = ControlRun(self.switchboard, ctl_run)

        ctl_info = {
            'run_id': ctl.control_run,
            'control_type': ctl.control_type,
            'control_id': ctl.control_id,
            'current_container_id': ctl.current_container,
            'current_parent_id': ctl.current_parent,
            'current_parent_pos': ctl.current_position,
            'comment_history': ctl.comment_history,
        }

        return [ctl_info]

    def apply_control_load_data(self, ctl_run):
        """Applies previously entered data to the load data fields by control
        Args:
            ctl_run: control run id string
        Returns:
            fields: list of fields with applied data
        """
        
        fields = []
        query = '''
            SELECT
                cr.controlRunId AS "runId",
                acd.analysisDataDefinitionId,
                    CASE addef.dataType
                        WHEN 'decimal' THEN 
                            CASE addef.sigFig
                                WHEN 0 THEN ROUND(acd.decimalResult, 0)
                                WHEN 1 THEN ROUND(acd.decimalResult, 1)
                                WHEN 2 THEN ROUND(acd.decimalResult, 2)
                                WHEN 3 THEN ROUND(acd.decimalResult, 3)
                                WHEN 4 THEN ROUND(acd.decimalResult, 4)
                                WHEN 5 THEN ROUND(acd.decimalResult, 5)
                                WHEN 6 THEN ROUND(acd.decimalResult, 6)
                            END
                        WHEN 'varchar' THEN acd.varcharResult
                        WHEN 'dateTime' THEN acd.dateTimeResult
                END AS "result",
                IFNULL(acd.actualInterpretation,'') AS "actualInterpretation",
                IFNULL(acd.referenceRange, '') AS "referenceRange" ,
                IFNULL(acd.units, IFNULL(addef.units, '')) AS "units",
                acd.isReportable AS "isReportable"
            FROM analysisControlData acd
                INNER JOIN analysisControlDataRuns acdr
                    ON acd.analysisControlDataRunsId = acdr.id
                INNER JOIN controlRuns cr
                    ON acdr.controlRunsId = cr.id
                INNER JOIN analysisDataDefinition addef
                    ON acd.analysisDataDefinitionId = addef.id
            WHERE cr.controlRunId = ?
                AND acd.analysisDataDefinitionId = ?
        '''
        try:
            stmt = self.switchboard.connection.prepareStatement(query)
            stmt.setString(1, ctl_run)
            
            for field in self.load_config:
                stmt.setString(2, field.get('load_id'))
                self.switchboard.log(str(stmt))
                rs = stmt.executeQuery()
                ctl_field = copy.deepcopy(field)
                if rs.next():
                    result = rs.getString('result')
                    ctl_field['value'] = self.format_if_date(result)
                    ctl_field['units'] = rs.getString('units')
                    ctl_field['actual_interpretation'] = rs.getString('actualInterpretation')
                    ctl_field['load_limit_override'] = rs.getString('referenceRange')    
                    ctl_field['interp_list'] = self.add_if_missing(ctl_field.get('interp_list'), rs.getString('actualInterpretation'))
                    ctl_field['is_reportable'] = rs.getString('isReportable')    
                else:
                    ctl_field['value'] = ''
                    ctl_field['units'] = ''
                    ctl_field['actual_interpretation'] = ''
                    ctl_field['load_limit_override'] = ''
                fields.append(ctl_field)
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')
            return fields
        
        except BaseException as e:
            self.switchboard.log("---*** PYTHON EXCEPTION AT APPLY_CONTROL_LOAD_DATA ***---")
            self.switchboard.log("ERROR MESSAGE: " + str(e.message))
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
            raise
            return
        except SQLException as e:
            self.switchboard.log("---*** SQL Exception AT APPLY_CONTROL_LOAD_DATA ***----")
            self.switchboard.log("ERROR MESSAGE: " + str(e.message))
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
            raise
            return
        finally:
            stmt.close()

    def determine_interpretation(self, limit_type, limits, result):
        """Calculates the correct interpretation based on the configured limits
        Args:
            limit_type: string of the limit type
            limits: list/object containing limits
            result: string of result
        Returns:
            interpretation
        """
        if limit_type == 'discrete':
           return self.determine_discrete(limits, result)
        elif limit_type == 'threshold':
            return self.determine_threshold(limits, result)
        elif limit_type == 'range':
            return self.determine_range(limits, result)
        else:
            return None

    def determine_discrete(self, limits, result):
        """Calculates the correct interpretation for discrete values
        Args:
            limits: list/object of configured limits
            result: string of result value
        Returns:
            interpretation
        """
        not_equal_interp = limits[0].get('not_equal_interpretation')
        interp = ''
        for limit in limits[1:]:
            try:
                if float(result) == float(limit.get('discrete_limit')):
                    interp = limit.get('equal_interpretation')
            except (ValueError, TypeError):
                if result == limit.get('discrete_limit'):
                    interp = limit.get('equal_interpretation')
        if not interp:
            return not_equal_interp
        else: 
            return interp

    def determine_threshold(self, limits, result):
        """Calculates threshold interpretation
        Args:
            limits: list/object of configured limits
            result: string of result value
        Returns:
            interpretation

        """
        try:
            result = float(result)
            threshold = float(limits.get('threshold_limit'))
            if result < threshold:
                return limits.get('below_threshold_interpretation')
            elif result == threshold:
                return limits.get('equal_threshold_interpretation')
            elif result > threshold:
                return limits.get('above_threshold_interpretation')
        except TypeError as e:
            self.switchboard.log('*** VALUE DOES NOT EXIST AT DETERMINE_THRESHOLD ***') 
            self.switchboard.log('ERROR MESSAGE: {}'.format(str(e.message)))
            return ''
        except ValueError as e:
            self.switchboard.log('***NON NUMERIC VALUE AT DETERMINE THRESHOLD***')
            self.switchboard.log('ERROR MESSAGE: {}'.format(str(e.message)))
            return ''


    def determine_range(self, limits, result):
        """Calculates range interpretation
        Args:
            limits: list/object of configured limits
            result: string of result value
        Returns:
            interpretation
        """
        try:
            result = float(result)
            lower = float(limits.get('lower_limit'))
            upper = float(limits.get('upper_limit'))
            if result < lower:
                return limits.get('below_lower_interpretation')
            elif result == lower:
                return limits.get('equal_lower_interpretation')
            elif result > lower and result < upper:
                return limits.get('in_range_interpretation')
            elif result == upper:
                return limits.get('equal_upper_interpretation')
            elif result > upper:
                return limits.get('above_upper_interpretation')
        except TypeError as e:
            self.switchboard.log('*** VALUE DOES NOT EXIST AT DETERMINE_RANGE ***') 
            self.switchboard.log('ERROR MESSAGE: {}'.format(str(e.message)))
            return ''
        except ValueError as e:
            self.switchboard.log('***NON NUMERIC VALUE AT DETERMINE_RANGE ***')
            self.switchboard.log('ERROR MESSAGE: {}'.format(str(e.message)))
            return ''

    def determine_reference_range(self, limit_type, limits, data_type, sig_fig):
        """formats string for limits
        Args:
            limits: list/object of configured limits
            limit_type: pre-defined limit type (discrete/threshold/range)
            data_type: data type of the result(varchar/decimal/dataTime)
            sig_fig: significant figures for degree of accuracy

        Returns:
            formatted reference range string
        """
        if data_type == 'decimalResult':
            try:
                if limit_type == 'threshold':
                    referenceRange = round(float(limits['threshold_limit']),sig_fig)
                    return 'Threshold: {}'.format(referenceRange)
                elif limit_type == 'range':
                    lowerRange = round(float(limits['lower_limit']),sig_fig)
                    upperRange = round(float(limits['upper_limit']),sig_fig)
                    return 'Range: {0} - {1}'.format(lowerRange, upperRange)
                elif limit_type == 'discrete':
                    referenceRange = []
                    for limit in limits[1:]:
                        discreteVal = str(round(float(limit['discrete_limit']),sig_fig))
                        referenceRange.append(discreteVal)
                    referenceRange = ', '.join(referenceRange)
                    return 'Target: {}'.format(referenceRange)
                else:
                    return None
            except (ValueError, TypeError) as e:
                self.switchboard.log('ERROR MESSAGE: {}'.format(str(e.message)))
                return None

        elif data_type == 'varcharResult' and limit_type == 'discrete' :
            referenceRange = []
            for limit in limits[1:]:
                referenceRange.append(limit.get('discrete_limit', ''))
            referenceRange = ', '.join(referenceRange)
            return 'Target: {}'.format(referenceRange)
        else:
            return None

from general_functions import insertContainerHistory
from general_functions import insert_comments

class SaveAnalysisData(AnalysisData):
    """Class used to save analysis data
    Attributes:
        method_version_id: analysis method version id
        protocol_step: protocol step name
    """
    from dateFormatter import DateFormatter
    
    def __init__(self, switchboard, method_version_id, protocol_step):
        AnalysisData.__init__(self, switchboard, method_version_id, protocol_step)

    def __repr__(self):
        return 'SaveAnalysisData(MethodVersion: {}, ProtocolStep: {})'.format(
                self.method_version_id, self._protocol_step)

    
    def save_table_data(self, table_object, is_control=False):
        """Saves data entered in analysis review step table structure
        Args:
            table_object: data structure of table info
            is_control: bool for what tables to save to
        """
        for row in table_object:
            spec_info = row[0]
            a_run_id = self.save_row_data(spec_info, is_control)
            for field in row[1:]:
                definer_type = field.get('definer_type')
                if definer_type == 'loadData':
                    self.update_load_data_interpretation(field, is_control)
                    self.update_load_data_isReportable(field, is_control)
                elif definer_type == 'data':
                    self.save_field_data(a_run_id, field, is_control)
                elif definer_type == 'detector':
                    self.save_field_data(a_run_id, field, is_control)
                    for modifier in field.get('modifiers'):
                        self.save_field_data(a_run_id, modifier, is_control)
                    pass #TODO loop through modifier fields, save each field
                else:
                    return None 
            
                        
    def save_row_data(self, spec_info, is_control=False):
        """Saves container history, comments, analysisDataRun info
        Args:
            spec_info: specimen info object
            is_control: bool for what table to save to
        Returns:
            a_run_id: last inserted analysis data run id
        """
        Statement = self.switchboard.statement
        run_id = spec_info.get('run_id')
        if is_control:
            table_name = 'analysisControlDataRuns'
            run_id_col = 'controlRunsId'
            run = ControlRun(self.switchboard,run_id)
        elif self.protocol_step == 'Analysis: Pool Tube Data Review':
            table_name = 'analysisPoolTubeDataRuns'
            run_id_col = 'poolTubeRunsId'
            run = PoolRun(self.switchboard, run_id)
        else:
            table_name = 'analysisDataRuns'
            run_id_col = 'specimenRunsId'
            run = Run(self.switchboard, run_id)
        query = '''
            INSERT INTO {}(
                {}, currentContainerId, currentParentId, currentParentPosition, 
                analysisMethodVersionId, result, eventId)VALUES(?,?,?,?,?,?,?)
        '''.format(table_name, run_id_col)
        try:
            stmt = self.switchboard.connection.prepareStatement(query, Statement.RETURN_GENERATED_KEYS)
            stmt.setString(1, run.table_id)
            stmt.setString(2, run.current_container)
            stmt.setString(3, run.current_parent)
            stmt.setString(4, run.current_position)
            stmt.setString(5, self.method_version_id)
            stmt.setString(6, spec_info.get('overallResult'))
            stmt.setLong(7, self.switchboard.eventId)
            self.switchboard.log(str(stmt))
            stmt.executeUpdate()
            a_run_id = self.get_last_id(stmt)

            if spec_info.get('comments'):
                insert_comments(self.switchboard,run_id, spec_info.get('comments'))

            insertContainerHistory(self.switchboard, run_id, self.switchboard.eventId)

            return a_run_id

        except BaseException as e:
            self.switchboard.log("---*** PYTHON EXCEPTION AT SAVE_ROW_DATA ***---")
            self.switchboard.log("ERROR MESSAGE: " + str(e.message))
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
            raise
            return
        except SQLException as e:
            self.switchboard.log("---*** SQL Exception AT SAVE_ROW_DATA ***----")
            self.switchboard.log("ERROR MESSAGE: " + str(e.message))
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
            raise
            return
        finally:
            stmt.close()

    def save_field_data(self, data_run_id, field, is_control=False):
        """Saves field data into analysisData table
        Args:
            data_run_id: analysis data runs id to associate data with
            field: field object
            is_control: bool to determine what tables to save to
        """

        if is_control:
            table_name = 'analysisControlData'
            run_id_col = 'analysisControlDataRunsId'
        elif self.protocol_step == 'Analysis: Pool Tube Data Review':
            table_name = 'analysisPoolTubeData'
            run_id_col = 'analysisPoolTubeDataRunsId'
        else:
            table_name = 'analysisData'
            run_id_col = 'analysisDataRunsId'
        query = '''
            INSERT INTO {}(
                {}, 
                analysisDataDefinitionId, 
                varcharResult, decimalResult, dateTimeResult,
                imageResult, referenceRange, units, 
                calculatedInterpretation, actualInterpretation,
                interpretationEventId, eventId, stepName, isReportable)
                VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?, ?)
        '''.format(table_name, run_id_col)
        data_type = field.get('data_type')
        result = null_if_blank(field.get('value'))

        try:
            stmt = self.switchboard.connection.prepareStatement(query)
            stmt.setString(1, data_run_id)
            stmt.setString(2, field.get('definition_id'))
            if data_type == 'varchar':
                stmt.setString(3, result)
                stmt.setString(4, None)
                stmt.setString(5, None)
                stmt.setString(6, None)
            elif data_type == 'decimal':
                stmt.setString(3, None)
                stmt.setString(4, result)
                stmt.setString(5, None)
                stmt.setString(6, None)
            elif data_type == 'dateTime':
                stmt.setString(3, None)
                stmt.setString(4, None)
                stmt.setString(5, self.convert_date_time_result(result))
                stmt.setString(6, None)
            elif data_type == 'image':
                stmt.setString(3, None)
                stmt.setString(4, None)
                stmt.setString(5, None)
                stmt.setString(6, result)
            else:
                stmt.setString(3, None)
                stmt.setString(4, None)
                stmt.setString(5, None)
                stmt.setString(6, None)

            stmt.setString(7, self.get_reference_range(field)) 
            stmt.setString(8, field.get('units'))
            stmt.setString(9, field.get('original_interpretation', ''))
            stmt.setString(10, field.get('actual_interpretation', ''))
            stmt.setLong(11, self.switchboard.eventId)
            stmt.setLong(12, self.switchboard.eventId)
            stmt.setString(13, self.switchboard.stepName)
            stmt.setInt(14, field.get('is_reportable', 1))
            self.switchboard.log(str(stmt))
            stmt.executeUpdate()

        except BaseException as e:
            self.switchboard.log("---*** PYTHON EXCEPTION AT SAVE_FIELD_DATA ***---")
            self.switchboard.log("ERROR MESSAGE: " + str(e.message))
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
            raise
            return
        except SQLException as e:
            self.switchboard.log("---*** SQL Exception AT SAVE_FIELD_DATA ***----")
            self.switchboard.log("ERROR MESSAGE: " + str(e.message))
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
            raise
            return
        finally:
            stmt.close()

    def convert_date_time_result(self, result):
        """Converts the entered date to correct format for saving
        Args:
            result: date string
        Returns:
            formatted date
        """
        if result:
            date = self.DateFormatter(self.switchboard, result)
            return  date.shortFormToDataBaseStr()
        else:
            self.switchboard.log('<<<< NO DATETIME RESULT ENTERED >>>>')
            return None

    def update_load_data_interpretation(self, field, is_control=False):
        """Updates load data interpretation if changed
        Args:
            field: field object
            is_control: bool for what table to save to
        """
        if is_control:
            table_name = 'analysisControlData'
        elif self.protocol_step == 'Analysis: Pool Tube Data Review':
            table_name = 'analysisPoolTubeData'
        else:
            table_name = 'analysisData'
        update = '''
            UPDATE {} SET actualInterpretation = ?, interpretationEventId = ? WHERE id = ?
        
        '''.format(table_name)

        if field.get('interpretation_change'):
            try:
                stmt = self.switchboard.connection.prepareStatement(update)
                stmt.setString(1, field.get('actual_interpretation'))
                stmt.setLong(2, self.switchboard.eventId)
                stmt.setString(3, field.get('data_id'))
                self.switchboard.log(str(stmt))
                stmt.executeUpdate()
            except SQLException as e:
                self.switchboard.log("---*** SQL Exception AT UPDATE_LOAD_DATA_INTERPRETATION ***----")
                self.switchboard.log("ERROR MESSAGE: " + str(e.message))
                self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
                raise
                return
            finally:
                stmt.close()
        else:
            return None

    def update_load_data_isReportable(self, field, is_control=False):
        """Updates load data isReportable
        Args:
            field: field object
            is_control: bool for what table to save to
        """
        if is_control:
            table_name = 'analysisControlData'
        elif self.protocol_step == 'Analysis: Pool Tube Data Review':
            table_name = 'analysisPoolTubeData'
        else:
            table_name = 'analysisData'
        update = '''
            UPDATE {} SET isReportable = ?  WHERE id = ?
        
        '''.format(table_name)

        try:
            stmt = self.switchboard.connection.prepareStatement(update)
            stmt.setInt(1, field.get('is_reportable'))
            stmt.setString(2, field.get('data_id'))
            self.switchboard.log(str(stmt))
            stmt.executeUpdate()
        except SQLException as e:
            self.switchboard.log("---*** SQL Exception AT UPDATE_LOAD_DATA_ISREPORTABLE ***----")
            self.switchboard.log("ERROR MESSAGE: " + str(e.message))
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
            raise
            return
        finally:
            stmt.close()
        
    def get_reference_range(self, field):
        """Returns the string to be saved as analysisData.referenceRange
        Args:
            field: feild obj
        Returns:
            formatted reference range string
        """
        if field.get('limit_type') == 'discrete' and field.get('data_type') == 'varchar':
            limit_str = []
            limits = field.get('limits')
            for limit in limits[1:]:
                limit_str.append(limit.get('discrete_limit', ''))
            limit_str = ', '.join(limit_str)
            limit_str = 'Target: {}'.format(limit_str)
            return limit_str
        else:
            return field.get('limit_string')

def null_if_blank(val):
    return val if val != '' else None

