class ControlRun(object):
    def __init__(self, switchboard, control_run_id):
        self.switchboard = switchboard
        self._control_run = control_run_id
        self._table_id = None
        self._run_type = None
        self._control_id = None
        self._current_container = None
        self._current_parent = None
        self._current_position = None
        self._completed_result = None
        self._control_type = None

        self.set_control_data()

    def __repr__(self):
        return 'ControlRun(RunId:{}, CtlId: {}, CtlType: {}, CurCont: {}, CurPar: {}, CurPos: {})'.format(
                self.control_run, self.control_id, self.control_type, self.current_container, 
                self.current_parent, self.current_position)
    @property
    def control_run(self):
        return self._control_run

    @property
    def table_id(self):
        return self._table_id

    @property
    def run_type(self):
        return self._run_type
    
    @property
    def control_id(self):
        return self._control_id

    @property
    def current_container(self):
        return self._current_container
    
    @current_container.setter
    def current_container(self, new_container_id):
        self._current_container = new_container_id

    @property
    def current_parent(self):
        return self._current_parent

    @current_parent.setter
    def current_parent(self, new_parent):
        self._current_parent = new_parent

    @property
    def current_position(self):
        return self._current_position

    @current_position.setter
    def current_position(self, new_position):
        self._current_position = new_position

    @property
    def completed_result(self):
        return self._completed_result

    @completed_result.setter
    def completed_result(self, completed_result):
        self._completed_result = completed_result

    @property
    def control_type(self):
        return self._control_type
    
    @property
    def comment_history(self):
        comments = [] 
        query = '''
            SELECT IFNULL(GROUP_CONCAT(DISTINCT(note) SEPARATOR '<br><br>'), '') AS 'commentHistory'
            FROM containerNotes
            WHERE containerId = ?
        '''
        stmt = self.switchboard.connection.prepareStatement(query)
        stmt.setString(1, self.control_run)
        rs = stmt.executeQuery()
        if rs.next():
            return rs.getString('commentHistory')
        else:
            return ''

    def set_control_data(self):
        """Sets the control run attributes on instantiation
        """
        query = '''
            SELECT
                cr.id AS 'tableId',
                cr.runType,
                cr.controlId,
                cr.currentContainerId,
                cr.currentParentId,
                cr.currentParentPosition,
                cr.completedResult,
                c.controlType
            FROM controlRuns cr
            INNER JOIN controls c
                ON c.controlId = cr.controlId
            WHERE cr.controlRunId = ?
        '''
        stmt = self.switchboard.connection.prepareStatement(query)
        stmt.setString(1, self.control_run)
        rs = stmt.executeQuery()

        if rs.next():
            self._table_id = rs.getString('tableId')
            self._runType = rs.getString('runType')
            self._control_id = rs.getString('controlId')
            self._current_container = rs.getString('currentContainerId')
            self._current_parent = rs.getString('currentParentId')
            self._current_position = rs.getString('currentParentPosition')
            self._completed_result = rs.getString('completedResult')
            self._control_type = rs.getString('controlType')
            return True
        else:
            return False

    def save_updates(self):
        """Saves updated to controlRuns table
            
            Can updated current container, current parent, current position, and completed result
            all other attributes are set at creation and cannot be updated
        """
        update = '''
            UPDATE controlRuns
                SET currentContainerId = ?,
                    currentParentId = ?,
                    currentParentPosition = ?,
                    completedResult = ?,
                    lastUpdatedEventId = ?,
                    completedEventId = ?
            WHERE controlRunId = ?
        '''
        stmt = self.switchboard.connection.prepareStatement(update)
        stmt.setString(1, self.current_container)
        stmt.setString(2, self.current_parent)
        stmt.setString(3, self.current_position)
        stmt.setString(4, self.completed_result)
        stmt.setLong(5, self.switchboard.eventId)
        if self.completed_result:
            stmt.setLong(6, self.switchboard.eventId)
        else:
            stmt.setString(6, None)
        stmt.setString(7, self.control_run)
        stmt.executeUpdate()
