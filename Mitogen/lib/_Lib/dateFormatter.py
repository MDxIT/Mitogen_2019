from datetime import datetime
import re

class DateFormatter:

  def __init__(self, switchboard, dateString):
    self.switchboard = switchboard
    self.dateString = dateString
    
  '''
    #
    # Returns the short format from uniflow in a format python can use
    #
  '''
  def getShortDateFormat(self):

    engineFormat = self.switchboard.dateShortFormat
    dateFormat = self.formatter(engineFormat)

    return dateFormat

  '''
    #
    # Returns the long format from uniflow in a format python can use
    #
  '''
  def getLongDateFormat(self):

    engineFormat = self.switchboard.dateLongFormat
    dateFormat = self.formatter(engineFormat)

    return dateFormat

  '''
    #
    # Converts engine date format to a python usable date format
    # toDo: use a map instead of replace
    #
  '''
  def formatter(self, engineFormat):
    dateFormat = engineFormat
    dateFormat = dateFormat.replace('MMM', '%b')
    dateFormat = dateFormat.replace('MM', '%m')
    dateFormat = dateFormat.replace('dd', '%d')
    dateFormat = dateFormat.replace('yyyy', '%Y')
    dateFormat = dateFormat.replace('HH', '%H')
    dateFormat = dateFormat.replace('hh', '%I')
    dateFormat = dateFormat.replace('mm', '%M')

    return dateFormat


  '''
    #
    # Converts a short form date to a datatime object
    #
  '''
  def shortFormToObj(self):
    dateStr = self.dateString
    dateFormat = self.getShortDateFormat()
    date_obj = datetime.strptime(dateStr,dateFormat)

    return date_obj

  '''
    #
    # Converts short formatted date to data base format for inserting
    #
  '''
  def shortFormToDataBaseStr(self):
    obj = self.shortFormToObj()
    f = '%Y-%m-%d %H:%M:%S'
    return datetime.strftime(obj,f)


  def createDateTimeObj(self, dateStr):

    f0 = '%Y-%m-%d %H:%M:%S.%f'
    f1= '%Y-%m-%d'
    try:
      date_obj = datetime.strptime(dateStr,f0)
    except:
      date_obj = datetime.strptime(dateStr,f1)

    return date_obj


  '''
    #
    # Converts database date to engines configured short format
    #
  '''
  def shortFormatDate(self):

    date = self.dateString

    dateObj = self.createDateTimeObj(date)
    dateFormat = self.getShortDateFormat()

    return dateObj.strftime(dateFormat)

    '''
    #
    # Converts database date to engines configured short format
    #
  '''
  def longFormatDate(self):

    date = self.dateString

    dateObj = self.createDateTimeObj(date)
    dateFormat = self.getLongDateFormat()

    return dateObj.strftime(dateFormat)
