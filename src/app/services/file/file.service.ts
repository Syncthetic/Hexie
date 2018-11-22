import { Injectable } from '@angular/core';
import { ElectronService } from '../../providers/electron.service';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  public file_data: object[]
  // public hex_data: string[]
  public selected_file: string
  private fs

  constructor(
    private electron: ElectronService
  ) {
    this.fs = electron.fs
  }

  choose_file () {
    const dialog = this.electron.remote.dialog
    const selected_file = dialog.showOpenDialog({properties: ['openFile', 'showHiddenFiles']}).shift()
    this.selected_file = selected_file
    return selected_file
  }

  read_file (file_path: string, cb?: Function) {
    this.fs.readFile(file_path, 'utf8', (err, data) => {
      if (err) console.error(err)
      this.file_data = data
      this.string_to_hex(data)
      if ( cb ) cb(data)
    })
  }

  string_to_hex (string: string): void {

    const chars = string.split('')
    const file_data = []
    chars.map(c => {
      const hex = new Buffer(c).toString('hex')
      const data = {
        char: c,
        hex
      }
      file_data.push(data)
    })

    this.file_data = file_data
    // const hex_data = new Buffer(string).toString('hex')
    // this.hex_data = hex_data.match(/.{1,2}/g)

    // console.log('set hex data from file_service', this.hex_data)
    // return hex_data
  }
}
