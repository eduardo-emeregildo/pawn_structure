#command to run is (in bin folder): ./tcscid path\to\query.tcl baseName outputFileName.csv
# When you pass the query string as an arg, pass it like so: replace space with @ and remove curly braces

#[lindex $argv 0] is first command arg, followed by 1,2 etc
# sc_game list 1 3 gw
#sc_game list 1 3659231 gw30b30WB\n filter


# puts "starting script.."
# set file_exists [file exists "quer.bat"]
# puts "$file_exists"


#this makes the the game list csv using the small scid databases

if {[file exists [lindex $argv 1]] == 0} {
    sc_base open [lindex $argv 0]
    set filter_num [sc_filter count]

    if {$filter_num == 0 } {
        puts -nonewline "0"
    } else {
        sc_game list 1 "$filter_num" g@w15@b15@W@B@r\n [lindex $argv 1] 
        }
}



