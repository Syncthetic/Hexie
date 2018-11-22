import { Component, OnInit, NgZone } from '@angular/core';
import { FileService } from '../../services/file/file.service'

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {

  // public hex_data: string[]
  public file_data: object[]
  private hex_loop
  public bits_per_row: number = 32

  public hex_group: object[]

  constructor(
    public file_service: FileService
  ) { }

  ngOnInit() {
  }

  await_new_hex_data () {
    // console.log('awaiting hex data')
    if ( !this.file_data ) {
      // console.log('this.hex_data', this.hex_data)
      if ( this.file_service.file_data ) {
        // console.log('this.file_service.hex_data', this.file_service.hex_data)
        this.file_data = this.file_service.file_data
        // console.log('should clear loop...')
        this.create_grouped_data()
        clearInterval(this.hex_loop)
      }
    } else {
      // console.log('else')
      if ( this.file_service.file_data !== this.file_data ) {
        // console.log('this.file_service.hex_data !== this.hex_data', this.file_service.hex_data !== this.hex_data)
        this.file_data = this.file_service.file_data
        this.create_grouped_data()
        clearInterval(this.hex_loop)
      }
    }
  }

  create_grouped_data () {
    this.group_hex_bits()
  }

  group_hex_bits () {
    const hex_groups = []
    const length = this.file_data.length
    for(let i = 0; i < length; i+= this.bits_per_row) {
      // console.log('Should slice ' + i + ' ' + this.bits_per_row)
      const new_group = this.file_data.slice(i, this.bits_per_row + i)
      hex_groups.push(new_group)
    }
    this.hex_group = hex_groups
    console.log('group_hex_bits', hex_groups)
  }

  select_file () {
    const file = this.file_service.choose_file()
    this.file_service.read_file(file)
    this.hex_loop = setInterval(this.await_new_hex_data.bind(this), 0)
  }

}
