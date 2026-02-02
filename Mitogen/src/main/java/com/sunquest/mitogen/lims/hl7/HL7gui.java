package com.sunquest.mitogen.lims.hl7;

import javax.swing.*;
import javax.swing.tree.DefaultMutableTreeNode;

import ca.uhn.hl7v2.model.Structure;

import java.awt.*;
import java.io.File;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;


/**
 * 
 * @author Daniel Oliver
 *
 */
public class HL7gui extends JFrame{
  
  public HL7gui() {
    this.setTitle("HL7 Data Viewer");
    
    JLabel chosenLabel = new JLabel("No File selected");
    
    JTextArea fileViewArea = new JTextArea("Press open to load file");
    fileViewArea.setEditable(false);
       
    JScrollPane scroll = new JScrollPane(fileViewArea);

    JTabbedPane tabby = new JTabbedPane();
    tabby.addTab("File View",null,scroll,"View File");
    JScrollPane treeView = new JScrollPane();
    tabby.addTab("Tree View", treeView);
    
    JButton fileButton = new JButton("open");
    // file select listener
    fileButton.addActionListener(e ->{     
      JFileChooser fc = new JFileChooser();
      //fc.setCurrentDirectory(new File("C:\\Users\\oliverd\\Desktop\\hl7 messages"));
      int result = fc.showOpenDialog(this);
      if(result == JFileChooser.APPROVE_OPTION) {
        File chosenFile = fc.getSelectedFile();
        System.out.println("file: "+chosenFile);
        chosenLabel.setText(chosenFile.getPath());
        String fileString = stringifyFile(chosenFile);
        fileString = fileString.replace("\n", "");
        fileString = fileString.replace('\r', '\n');
        System.out.println(fileString);
        fileViewArea.setText(fileString);
        HL7MitoProcessingHandler.printHL7FieldsFromFile(chosenFile);
        DefaultMutableTreeNode top = new DefaultMutableTreeNode(chosenFile.getName());
        Structure msg = HL7MitoProcessingHandler.getMessageFromFile(chosenFile.toPath());
        if(msg != null)
          HL7MitoProcessingHandler.buildStructTree(msg, top);
        else
          System.out.println("Error: Problem parsing HL7 Message");
        JTree newTree = new JTree(top);
        for (int i = 0; i < newTree.getRowCount(); i++)
          newTree.expandRow(i);        
        treeView.setViewportView(newTree);
      }
    });
    
    JPanel buttonPanel = new JPanel();
    
    buttonPanel.add(fileButton);
    
    Container cp = this.getContentPane();    
    cp.setLayout(new BorderLayout());
    cp.add(chosenLabel,BorderLayout.NORTH);
    cp.add(tabby,BorderLayout.CENTER);
    cp.add(buttonPanel, BorderLayout.SOUTH);
    
    this.pack();
    this.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
    this.setSize(640,480);
    this.setVisible(true);
  }
  
  
  
  /**
   * Reads a file using UTF_8 encoding into a String
   * 
   * @param f file to convert to string
   * @return String of the entire file
   */
  public static String stringifyFile(File f) {
    try {
      return new String(Files.readAllBytes(f.toPath()), StandardCharsets.UTF_8);
    }catch(Exception e) {
      e.printStackTrace();
      return null;
    }
  }
    
  public static void main(String args[]) {
    new HL7gui();
  }  
}
