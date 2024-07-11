
#this script gets move number and whose side it is to move when the search was found

#command to run is (in bin folder): ./tcscid path\to\queryWithPosition.tcl baseName queryString outputFileName.csv
# When you pass the query string as an arg, pass it like so: replace space with @ and remove curly braces

#in the output file, the movenumber and side are together without white space separator to save space in the psql table. Both will be going on one column only

# Example command: ./tcscid C:\Users\emere\Desktop\pawn_structure_project\pawn_structure\queryWithPosition.tcl LumbrasGigaBase '-wq@0 1@-bq@0 1@-wr@0 2@-br@0 2@-wn@0 2@-bn@0 2@-wm@0 4@-bm@0 4@-wp@1 8@-bp@0 8@-wb@0 2@-bb@0 2@-range@1 25@-length@2@-pattern@1 wp d 4@-pattern@0 wp c ?@-pattern@0 wp e ?' IQP.csv


sc_base open [lindex $argv 0]
set queryArgs [split [lindex $argv 1] "@"]
# foreach i $queryArgs {
#     puts "$i"
# }
sc_search material {*}$queryArgs
# set filter_num [sc_filter count]
set curr_num [sc_filter first]
set white "white"
set id 1
# sc_game load $curr_num
# set moveNum [sc_pos moveNum]
# set side [ sc_pos side]
# if {$side == $white} {
#     set side 1
# } else {
#     set side 0
# }
# puts "$moveNum $side"


puts "Now starting to get movenumber/side to play..."
set fid [open [lindex $argv 2] w]
while {$curr_num != 0} {
    sc_game load $curr_num
    set moveNum [sc_pos moveNum]
    set side [ sc_pos side]
    if {$side == $white} {
    set side 1
} else {
    set side 0
}
    puts $fid "$id,$moveNum$side"
    set curr_num [sc_filter next]
    set id [expr {$id + 1}]
}

close $fid




