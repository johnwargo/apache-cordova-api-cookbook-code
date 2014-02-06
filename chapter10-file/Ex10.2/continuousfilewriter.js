/*
 * Copyright (C) 2011 Wolfgang Koller
 *
 * This file is part of GOFG Sports Computer - http://www.gofg.at/.
 *
 * GOFG Sports Computer is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * GOFG Sports Computer is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with GOFG Sports Computer.  If not, see <http://www.gnu.org/licenses/>.
 */

function ContinuousFileWriter(p_fileEntry) {
  // Define the member variables
  var m_writeStack = new Array();
  var m_fileEntry = p_fileEntry;
  var m_fileWriter = null;

  // Define our member functions
  this.writeLine = writeLine;
  this.write = write;
  this._checkWrite = _checkWrite;
  this._write = _write;
  this._fileWriter = _fileWriter;
  this._fileError = _fileError;

  // Create a writer for the file-entry
  m_fileEntry.createWriter(_fileWriter);

  function writeLine(p_lineText) {
    write(p_lineText + "\n");
  }

  function write(p_text) {
    m_writeStack.push(p_text);

    _checkWrite();
  }

  function _checkWrite() {
    //		console.log( "Checking write: " + m_fileWriter + " / " + m_fileWriter.readyState );
    if (m_fileWriter != null && m_fileWriter.readyState != FileWriter.WRITING)
      _write();
  }

  function _write() {
    if (m_writeStack.length <= 0)
      return;
    //		console.log( "Writing..." );
    m_fileWriter.write(m_writeStack.shift());
  }

  // Callback once the writer is ready
  function _fileWriter(p_fileWriter) {
    //		console.log( "CFW: FileWriter ready" );
    m_fileWriter = p_fileWriter;
    m_fileWriter.onerror = _fileError;
    m_fileWriter.onwriteend = _checkWrite;
    // Check for writing immediately
    _checkWrite();
  }

  // Called whenever an error occurs
  function _fileError(p_fileError) {
    console.log("Error while handling file-writing: " + p_fileError.code);
  }

}
