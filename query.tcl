
#command to run is (in bin folder): ./tcscid path\to\query.tcl baseName queryString outputFileName.txt
# When you pass the query string as an arg, pass it like so: replace space with @ and remove curly braces

#[lindex $argv 0] is first command arg, followed by 1,2 etc
# sc_game list 1 3 gw
#sc_game list 1 3659231 gw30b30WB\n filter


puts "starting script.."
sc_base open [lindex $argv 0]

set queryArgs [split [lindex $argv 1] "@"]
# foreach i $queryArgs {
#     puts "$i"
# }
sc_search material {*}$queryArgs
set filter_num [sc_filter count]
puts "$filter_num"
sc_game list 1 "$filter_num" gw15b15WBr\n [lindex $argv 2]
puts "script completed"


