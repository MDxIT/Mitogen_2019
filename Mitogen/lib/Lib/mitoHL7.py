#------------------------------------------------------------------------#
#                            UNIconnect LC                               #
#                 UNIFLOW Demonstration Process Definition               #
#                       CONFIDENTIAL INFORMATION                         #
#        Copyright (C) 2001-2016 UNIConnect LC.  All rights reserved.    #
#------------------------------------------------------------------------#

class apiHL7Helper(object):
    def __init__(self):
        self.endcodingMSHDefault = "^~\\&"

    def escapeEncoders(self, fieldData):
        fieldData = fieldData.replace("^", "\\S\\")
        fieldData = fieldData.replace("|", "\\F\\")
        fieldData = fieldData.replace("~", "\\R\\")
        fieldData = fieldData.replace("\\", "\\E\\")
        fieldData = fieldData.replace("&", "\\T\\")

        return fieldData

    def removeEncoders(self, fieldData):
        fieldData = fieldData.replace("\\S\\", "^")
        fieldData = fieldData.replace("\\F\\", "|")
        fieldData = fieldData.replace("\\R\\", "~")
        fieldData = fieldData.replace("\\E\\", "\\")
        fieldData = fieldData.replace("\\T\\", "&")

        return fieldData

class HL7Segment(object):
    def __init__(self):
        self.sortOrder = 0
        self.segment = ""
        self.joinCondition = ""

class HL7SegmentMapper(object):
    def __init__(self):
        self.parentSegment = ""
        self.childSegment = ""
        self.segmentData = {}

if __name__ == "__main__":
    pass